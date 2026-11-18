import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Eye,
  Trash2,
  X,
  Phone,
  Mail,
  Calendar,
  Clock,
  Sparkles,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminApiRequest, extractItems, formatDate } from '@/admin/lib/api';
import type { AdminAppointment, AdminPaginatedResponse } from '@/admin/types';
import type { AppointmentStatus } from '@/types';
import DataTable, { type Column } from '@/admin/components/DataTable';
import StatusBadge from '@/admin/components/StatusBadge';
import { ConfirmDialog } from '@/admin/components/Modal';

const STATUS_TABS: Array<{ label: string; value: 'all' | AppointmentStatus }> = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const STATUS_OPTIONS: AppointmentStatus[] = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
];

export default function AdminAppointmentsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [selectedAppointment, setSelectedAppointment] =
    useState<AdminAppointment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminAppointment | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-appointments', statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('page_size', String(pageSize));
      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }
      const res = await adminApiRequest<
        AdminAppointment[] | AdminPaginatedResponse<AdminAppointment>
      >(`/appointments?${params.toString()}`);

      if (Array.isArray(res)) {
        return {
          items: res,
          total: res.length,
          pages: Math.max(1, Math.ceil(res.length / pageSize)),
        };
      }
      return {
        items: extractItems(res),
        total: res.total ?? extractItems(res).length,
        pages: res.pages ?? 1,
      };
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      adminApiRequest<AdminAppointment>(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: (updated) => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      if (selectedAppointment?.id === updated.id) {
        setSelectedAppointment(updated);
      }
    },
    onError: () => {
      setActionError('Failed to update appointment status. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      adminApiRequest(`/appointments/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      setActionError(null);
      if (selectedAppointment?.id === deleteTarget?.id) {
        setSelectedAppointment(null);
      }
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: () => {
      setActionError('Failed to delete appointment.');
      setDeleteTarget(null);
    },
  });

  const filteredAppointments = useMemo(() => {
    const items = data?.items ?? [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (a) =>
        a.customer_name.toLowerCase().includes(q) ||
        a.service.toLowerCase().includes(q) ||
        a.mobile.includes(q)
    );
  }, [data?.items, searchQuery]);

  const columns: Column<AdminAppointment>[] = [
    {
      key: 'customer_name',
      header: 'Customer',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-espresso">{row.customer_name}</p>
          <p className="text-xs text-espresso/60">{row.mobile}</p>
        </div>
      ),
    },
    {
      key: 'service',
      header: 'Service',
      sortable: true,
      render: (row) => <span>{row.service}</span>,
    },
    {
      key: 'preferred_date',
      header: 'Date',
      sortable: true,
      render: (row) => <span>{formatDate(row.preferred_date)}</span>,
    },
    {
      key: 'preferred_time',
      header: 'Time',
      render: (row) => <span>{row.preferred_time}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setSelectedAppointment(row)}
            className="rounded-sm p-1.5 text-espresso/70 transition-colors hover:bg-champagne/60 hover:text-espresso"
            title="View details"
            aria-label={`View appointment for ${row.customer_name}`}
          >
            <Eye className="h-4 w-4" />
          </button>

          <select
            value={row.status}
            onChange={(e) =>
              updateStatusMutation.mutate({
                id: row.id,
                status: e.target.value as AppointmentStatus,
              })
            }
            disabled={updateStatusMutation.isPending}
            aria-label={`Update status for ${row.customer_name}`}
            className="rounded-sm border border-champagne bg-white px-2 py-1 text-xs text-espresso focus:border-rose focus:outline-none"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="capitalize">
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="rounded-sm p-1.5 text-red-600/80 transition-colors hover:bg-red-50 hover:text-red-700"
            title="Delete appointment"
            aria-label={`Delete appointment for ${row.customer_name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-espresso">
            Appointments
          </h2>
          <p className="text-sm text-espresso/60">
            Review booking requests, update statuses, and view client notes.
          </p>
        </div>
      </div>

      {/* Error alert */}
      {(isError || actionError) && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              {actionError ?? 'Could not load appointments. Please try again.'}
            </span>
          </div>
          {isError && (
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-sm border border-red-300 bg-white px-3 py-1 text-xs font-medium hover:bg-red-100"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-champagne/70 bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
                className={cn(
                  'rounded-sm px-3 py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'bg-espresso text-white'
                    : 'bg-ivory text-espresso/70 hover:bg-champagne/60 hover:text-espresso'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer or service..."
            className="w-full rounded-sm border border-champagne bg-ivory/40 py-2 pl-9 pr-3 text-sm text-espresso placeholder:text-taupe focus:border-rose focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredAppointments}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => setSelectedAppointment(row)}
        isLoading={isLoading}
        emptyMessage="No appointments match the selected filter."
        pageSize={pageSize}
        currentPage={page}
        totalPages={data?.pages ?? 1}
        totalItems={data?.total ?? filteredAppointments.length}
        onPageChange={setPage}
      />

      {/* Slide-over Details Panel */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-espresso/50 backdrop-blur-xs"
            onClick={() => setSelectedAppointment(null)}
          />
          <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-champagne/70 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-rose">
                  Appointment Details
                </p>
                <h3 className="font-display text-xl font-bold text-espresso">
                  {selectedAppointment.customer_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-sm p-1.5 text-espresso/50 hover:bg-ivory hover:text-espresso"
                aria-label="Close details panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div className="flex items-center justify-between rounded-lg bg-ivory p-4">
                <span className="text-xs font-medium uppercase tracking-wider text-espresso/60">
                  Current Status
                </span>
                <StatusBadge status={selectedAppointment.status} />
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-rose" />
                  <div>
                    <p className="text-xs text-espresso/60">Requested Service</p>
                    <p className="font-medium text-espresso">
                      {selectedAppointment.service}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-rose" />
                  <div>
                    <p className="text-xs text-espresso/60">Preferred Date</p>
                    <p className="font-medium text-espresso">
                      {formatDate(selectedAppointment.preferred_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-rose" />
                  <div>
                    <p className="text-xs text-espresso/60">Preferred Time</p>
                    <p className="font-medium text-espresso">
                      {selectedAppointment.preferred_time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-rose" />
                  <div>
                    <p className="text-xs text-espresso/60">Mobile</p>
                    <p className="font-medium text-espresso">
                      {selectedAppointment.mobile}
                    </p>
                  </div>
                </div>

                {selectedAppointment.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-rose" />
                    <div>
                      <p className="text-xs text-espresso/60">Email</p>
                      <p className="font-medium text-espresso">
                        {selectedAppointment.email}
                      </p>
                    </div>
                  </div>
                )}

                {(selectedAppointment.special_requirements ||
                  selectedAppointment.message) && (
                  <div className="flex items-start gap-3">
                    <MessageSquare className="mt-0.5 h-4 w-4 text-rose" />
                    <div>
                      <p className="text-xs text-espresso/60">Notes / Requirements</p>
                      <p className="mt-1 whitespace-pre-wrap rounded-sm bg-ivory p-3 text-espresso/80">
                        {selectedAppointment.special_requirements ||
                          selectedAppointment.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-champagne/70 pt-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-espresso/70">
                  Update Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_OPTIONS.map((statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      disabled={updateStatusMutation.isPending}
                      onClick={() =>
                        updateStatusMutation.mutate({
                          id: selectedAppointment.id,
                          status: statusOption,
                        })
                      }
                      className={cn(
                        'rounded-sm border px-3 py-2 text-xs font-medium capitalize transition-colors',
                        selectedAppointment.status === statusOption
                          ? 'border-espresso bg-espresso text-white'
                          : 'border-champagne bg-white text-espresso hover:bg-ivory'
                      )}
                    >
                      {statusOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-champagne/70 bg-ivory/60 px-6 py-4">
              <span className="text-xs text-espresso/50">
                Booked {formatDate(selectedAppointment.created_at)}
              </span>
              <button
                type="button"
                onClick={() => setDeleteTarget(selectedAppointment)}
                className="inline-flex items-center gap-1.5 rounded-sm border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
        title="Delete Appointment"
        message={`Are you sure you want to delete the appointment for "${deleteTarget?.customer_name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

