import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Users,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { adminApiRequest, extractItems, formatDate } from '@/admin/lib/api';
import type { AdminAppointment, AdminCustomer } from '@/admin/types';
import DataTable, { type Column } from '@/admin/components/DataTable';
import Modal from '@/admin/components/Modal';
import StatusBadge from '@/admin/components/StatusBadge';

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] =
    useState<AdminCustomer | null>(null);

  const { data: customers = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      try {
        const res = await adminApiRequest<
          AdminCustomer[] | { items: AdminCustomer[] }
        >('/customers?page_size=100');
        return extractItems(res);
      } catch {
        /* fallback to aggregating from appointments */
      }

      const apptsRes = await adminApiRequest<
        AdminAppointment[] | { items: AdminAppointment[] }
      >('/appointments?page_size=100');
      const appointments = extractItems(apptsRes);

      const map = new Map<string, AdminCustomer>();
      for (const apt of appointments) {
        const key = apt.mobile || apt.customer_name.toLowerCase();
        const existing = map.get(key);
        if (!existing) {
          map.set(key, {
            id: key,
            customer_name: apt.customer_name,
            mobile: apt.mobile,
            email: apt.email,
            booking_count: 1,
            completed_bookings: apt.status === 'completed' ? 1 : 0,
            last_visit: apt.preferred_date,
            last_service: apt.service,
          });
        } else {
          existing.booking_count += 1;
          if (apt.status === 'completed') {
            existing.completed_bookings = (existing.completed_bookings ?? 0) + 1;
          }
          if (
            apt.preferred_date &&
            (!existing.last_visit || apt.preferred_date > existing.last_visit)
          ) {
            existing.last_visit = apt.preferred_date;
            existing.last_service = apt.service;
          }
          if (!existing.email && apt.email) {
            existing.email = apt.email;
          }
        }
      }

      return Array.from(map.values()).sort(
        (a, b) => b.booking_count - a.booking_count
      );
    },
  });

  const { data: customerHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ['admin-customer-history', selectedCustomer?.mobile],
    enabled: Boolean(selectedCustomer),
    queryFn: async () => {
      const res = await adminApiRequest<
        AdminAppointment[] | { items: AdminAppointment[] }
      >('/appointments?page_size=100');
      const all = extractItems(res);
      return all.filter(
        (a) =>
          a.mobile === selectedCustomer?.mobile ||
          a.customer_name.toLowerCase() ===
            selectedCustomer?.customer_name.toLowerCase()
      );
    },
  });

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.customer_name.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        (c.email ?? '').toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  const columns: Column<AdminCustomer>[] = [
    {
      key: 'customer_name',
      header: 'Customer',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory text-xs font-semibold text-rose-dark border border-champagne">
            {row.customer_name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-espresso">{row.customer_name}</p>
            {row.email && (
              <p className="text-xs text-espresso/60">{row.email}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'mobile',
      header: 'Mobile',
      render: (row) => <span className="text-sm">{row.mobile}</span>,
    },
    {
      key: 'booking_count',
      header: 'Total Bookings',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center rounded-full bg-ivory px-2.5 py-0.5 text-xs font-semibold text-espresso border border-champagne">
          {row.booking_count}
        </span>
      ),
    },
    {
      key: 'last_visit',
      header: 'Last Visit',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm">{formatDate(row.last_visit)}</p>
          {row.last_service && (
            <p className="text-xs text-espresso/60">{row.last_service}</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-espresso">
            Customers
          </h2>
          <p className="text-sm text-espresso/60">
            Client directory aggregated from salon appointments and visits.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, or email..."
            className="w-full rounded-sm border border-champagne bg-white py-2 pl-9 pr-3 text-sm text-espresso placeholder:text-taupe focus:border-rose focus:outline-none"
          />
        </div>
      </div>

      {isError && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Failed to load customer records.</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-sm border border-red-300 bg-white px-3 py-1 text-xs font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && customers.length === 0 ? (
        <div className="rounded-lg border border-champagne/70 bg-white p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-taupe" />
          <p className="mt-3 text-sm text-espresso/60">
            No customer booking records found yet.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredCustomers}
          keyExtractor={(row) => row.id || row.mobile}
          onRowClick={(row) => setSelectedCustomer(row)}
          isLoading={isLoading}
          emptyMessage="No customers match your search."
        />
      )}

      <Modal
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.customer_name ?? 'Customer Profile'}
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 rounded-lg bg-ivory p-4 text-sm sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-rose" />
                <span>{selectedCustomer.mobile}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-rose" />
                <span className="truncate">
                  {selectedCustomer.email || 'No email'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-rose" />
                <span>{selectedCustomer.booking_count} total bookings</span>
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-display text-base font-semibold text-espresso">
                Appointment History
              </h4>
              {historyLoading ? (
                <div className="h-24 animate-pulse rounded-sm bg-ivory" />
              ) : customerHistory.length === 0 ? (
                <p className="text-sm text-espresso/60">
                  No appointment history found.
                </p>
              ) : (
                <div className="divide-y divide-champagne/60 rounded-lg border border-champagne/70">
                  {customerHistory.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                    >
                      <div>
                        <p className="font-medium text-espresso">{apt.service}</p>
                        <p className="text-xs text-espresso/60">
                          {formatDate(apt.preferred_date)} &middot;{' '}
                          {apt.preferred_time}
                        </p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

