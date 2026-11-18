import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { adminApiRequest, extractItems, formatDate } from '@/admin/lib/api';
import type { AdminTestimonial } from '@/admin/types';
import DataTable, { type Column } from '@/admin/components/DataTable';
import StatusBadge from '@/admin/components/StatusBadge';
import Modal, { ConfirmDialog } from '@/admin/components/Modal';

interface TestimonialFormState {
  id?: string;
  customer_name: string;
  service: string;
  feedback: string;
  rating: number;
  customer_photo_url: string;
  is_approved: boolean;
}

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalForm, setModalForm] = useState<TestimonialFormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminTestimonial | null>(null);

  const { data: testimonials = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const res = await adminApiRequest<
        AdminTestimonial[] | { items: AdminTestimonial[] }
      >('/testimonials/admin?page_size=100');
      return extractItems(res);
    },
  });

  const saveMutation = useMutation({
    mutationFn: (form: TestimonialFormState) => {
      const payload = {
        customer_name: form.customer_name,
        service: form.service || null,
        feedback: form.feedback,
        rating: Number(form.rating),
        customer_photo_url: form.customer_photo_url || null,
        is_approved: form.is_approved,
      };
      if (form.id) {
        return adminApiRequest(`/testimonials/${form.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      return adminApiRequest('/testimonials', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      setErrorMsg(null);
      setModalForm(null);
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    },
    onError: () => setErrorMsg('Failed to save testimonial.'),
  });

  const toggleApprovalMutation = useMutation({
    mutationFn: ({ id, is_approved }: { id: string; is_approved: boolean }) =>
      adminApiRequest(`/testimonials/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_approved }),
      }),
    onSuccess: () => {
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    },
    onError: () => {
      setErrorMsg('Failed to update testimonial approval status.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      adminApiRequest(`/testimonials/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      setErrorMsg(null);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    },
    onError: () => {
      setErrorMsg('Failed to delete testimonial.');
      setDeleteTarget(null);
    },
  });

  const columns: Column<AdminTestimonial>[] = [
    {
      key: 'customer_name',
      header: 'Customer',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-espresso">{row.customer_name}</p>
          {row.service && (
            <p className="text-xs text-espresso/60">{row.service}</p>
          )}
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-0.5 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < row.rating ? 'fill-amber-400 text-amber-400' : 'text-champagne'
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      key: 'feedback',
      header: 'Feedback',
      render: (row) => (
        <p className="max-w-md truncate text-xs text-espresso/80" title={row.feedback}>
          {row.feedback}
        </p>
      ),
    },
    {
      key: 'is_approved',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <StatusBadge
          status={row.is_approved ? 'approved' : 'pending'}
          label={row.is_approved ? 'Approved' : 'Pending'}
        />
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (row) => (
        <span className="text-xs text-espresso/60">
          {formatDate(row.created_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              toggleApprovalMutation.mutate({
                id: row.id,
                is_approved: !row.is_approved,
              })
            }
            disabled={toggleApprovalMutation.isPending}
            title={row.is_approved ? 'Reject / Hide' : 'Approve & Publish'}
            className={`inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium transition-colors ${
              row.is_approved
                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {row.is_approved ? (
              <>
                <XCircle className="h-3.5 w-3.5" />
                Unpublish
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              setModalForm({
                id: row.id,
                customer_name: row.customer_name,
                service: row.service ?? '',
                feedback: row.feedback,
                rating: row.rating,
                customer_photo_url: row.customer_photo_url ?? '',
                is_approved: row.is_approved,
              })
            }
            className="rounded-sm p-1.5 text-espresso/70 hover:bg-ivory hover:text-espresso"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="rounded-sm p-1.5 text-red-600/80 hover:bg-red-50 hover:text-red-700"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-espresso">
            Testimonials & Reviews
          </h2>
          <p className="text-sm text-espresso/60">
            Approve client reviews for display on the public website.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setModalForm({
              customer_name: '',
              service: '',
              feedback: '',
              rating: 5,
              customer_photo_url: '',
              is_approved: true,
            })
          }
          className="inline-flex items-center gap-2 self-start rounded-sm bg-rose px-4 py-2 text-sm font-medium text-white hover:bg-rose-dark sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Testimonial
        </button>
      </div>

      {(isError || errorMsg) && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg ?? 'Could not load testimonials.'}</span>
          </div>
          {isError && (
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-sm border border-red-300 bg-white px-3 py-1 text-xs font-medium"
            >
              Retry
            </button>
          )}
        </div>
      )}

      <DataTable
        columns={columns}
        data={testimonials}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="No client testimonials yet."
      />

      <Modal
        isOpen={Boolean(modalForm)}
        onClose={() => setModalForm(null)}
        title={modalForm?.id ? 'Edit Testimonial' : 'Add Testimonial'}
      >
        {modalForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate(modalForm);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.customer_name}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, customer_name: e.target.value })
                  }
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Service Received
                </label>
                <input
                  type="text"
                  value={modalForm.service}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, service: e.target.value })
                  }
                  placeholder="e.g. Bridal Makeup"
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Rating (1-5) *
                </label>
                <select
                  value={modalForm.rating}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, rating: Number(e.target.value) })
                  }
                  className="w-full rounded-sm border border-champagne bg-white px-3 py-2 text-sm focus:border-rose focus:outline-none"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Star{r > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Customer Photo URL
                </label>
                <input
                  type="url"
                  value={modalForm.customer_photo_url}
                  onChange={(e) =>
                    setModalForm({
                      ...modalForm,
                      customer_photo_url: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Feedback *
              </label>
              <textarea
                rows={4}
                required
                value={modalForm.feedback}
                onChange={(e) =>
                  setModalForm({ ...modalForm, feedback: e.target.value })
                }
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-espresso">
              <input
                type="checkbox"
                checked={modalForm.is_approved}
                onChange={(e) =>
                  setModalForm({ ...modalForm, is_approved: e.target.checked })
                }
                className="rounded-sm border-champagne text-rose focus:ring-rose"
              />
              Approved for public display
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalForm(null)}
                className="rounded-sm border border-champagne px-4 py-2 text-sm font-medium text-espresso hover:bg-ivory"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="rounded-sm bg-espresso px-4 py-2 text-sm font-medium text-white hover:bg-espresso-light disabled:opacity-50"
              >
                {saveMutation.isPending ? 'Saving...' : 'Save Testimonial'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
        title="Delete Testimonial"
        message={`Are you sure you want to delete the testimonial from "${deleteTarget?.customer_name}"?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

