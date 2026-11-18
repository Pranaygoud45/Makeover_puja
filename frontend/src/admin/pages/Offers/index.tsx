import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Pencil,
  Trash2,
  BadgePercent,
  Calendar,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { adminApiRequest, extractItems, formatDate } from '@/admin/lib/api';
import type { AdminOffer } from '@/admin/types';
import Modal, { ConfirmDialog } from '@/admin/components/Modal';
import StatusBadge from '@/admin/components/StatusBadge';

interface OfferFormState {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  valid_until: string;
  code: string;
  is_active: boolean;
}

function isOfferExpired(offer: AdminOffer): boolean {
  if (!offer.valid_until) return false;
  const today = new Date().toISOString().slice(0, 10);
  return offer.valid_until < today;
}

export default function AdminOffersPage() {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalForm, setModalForm] = useState<OfferFormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminOffer | null>(null);

  const { data: offers = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-offers'],
    queryFn: async () => {
      const res = await adminApiRequest<AdminOffer[] | { items: AdminOffer[] }>(
        '/offers?active_only=false&page_size=100'
      );
      return extractItems(res);
    },
  });

  const saveMutation = useMutation({
    mutationFn: (form: OfferFormState) => {
      const payload = {
        title: form.title,
        description: form.description || null,
        image_url: form.image_url || null,
        valid_until: form.valid_until || null,
        code: form.code ? form.code.toUpperCase() : null,
        is_active: form.is_active,
      };
      if (form.id) {
        return adminApiRequest(`/offers/${form.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      return adminApiRequest('/offers', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      setErrorMsg(null);
      setModalForm(null);
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
    },
    onError: () => setErrorMsg('Failed to save offer.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      adminApiRequest(`/offers/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      setErrorMsg(null);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
    },
    onError: () => {
      setErrorMsg('Failed to delete offer.');
      setDeleteTarget(null);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-espresso">
            Offers & Promotions
          </h2>
          <p className="text-sm text-espresso/60">
            Manage seasonal discounts, bridal promo codes, and validity dates.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setModalForm({
              title: '',
              description: '',
              image_url: '',
              valid_until: '',
              code: '',
              is_active: true,
            })
          }
          className="inline-flex items-center gap-2 self-start rounded-sm bg-rose px-4 py-2 text-sm font-medium text-white hover:bg-rose-dark sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Offer
        </button>
      </div>

      {(isError || errorMsg) && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg ?? 'Could not load offers.'}</span>
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

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-56 animate-pulse rounded-lg bg-white" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="rounded-lg border border-champagne/70 bg-white p-12 text-center">
          <BadgePercent className="mx-auto h-10 w-10 text-taupe" />
          <p className="mt-3 text-sm text-espresso/60">
            No promotional offers created yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => {
            const expired = isOfferExpired(offer);
            const status = !offer.is_active
              ? 'inactive'
              : expired
              ? 'expired'
              : 'active';

            return (
              <div
                key={offer.id}
                className="flex flex-col justify-between overflow-hidden rounded-lg border border-champagne/70 bg-white shadow-xs"
              >
                <div>
                  {offer.image_url && (
                    <div className="aspect-16/9 overflow-hidden bg-ivory">
                      <img
                        src={offer.image_url}
                        alt={offer.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold text-espresso">
                        {offer.title}
                      </h3>
                      <StatusBadge
                        status={status}
                        label={
                          status === 'expired'
                            ? 'Expired'
                            : status === 'active'
                            ? 'Active'
                            : 'Inactive'
                        }
                      />
                    </div>

                    {offer.description && (
                      <p className="mt-2 text-xs leading-relaxed text-espresso/70">
                        {offer.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-espresso/70">
                      {offer.code && (
                        <span className="inline-flex items-center gap-1 rounded-sm border border-dashed border-rose/60 bg-ivory px-2 py-1 font-mono font-semibold text-rose-dark">
                          <Tag className="h-3 w-3" />
                          {offer.code}
                        </span>
                      )}
                      {offer.valid_until && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-taupe" />
                          Valid until {formatDate(offer.valid_until)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-champagne/50 bg-ivory/40 px-5 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      setModalForm({
                        id: offer.id,
                        title: offer.title,
                        description: offer.description ?? '',
                        image_url: offer.image_url ?? '',
                        valid_until: offer.valid_until ?? '',
                        code: offer.code ?? '',
                        is_active: offer.is_active,
                      })
                    }
                    className="inline-flex items-center gap-1 rounded-sm border border-champagne bg-white px-2.5 py-1.5 text-xs font-medium text-espresso hover:bg-ivory"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(offer)}
                    className="inline-flex items-center gap-1 rounded-sm border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={Boolean(modalForm)}
        onClose={() => setModalForm(null)}
        title={modalForm?.id ? 'Edit Offer' : 'Add Offer'}
      >
        {modalForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate(modalForm);
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Offer Title *
              </label>
              <input
                type="text"
                required
                value={modalForm.title}
                onChange={(e) =>
                  setModalForm({ ...modalForm, title: e.target.value })
                }
                placeholder="e.g. Festive Bridal 20% Off"
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Promo Code
                </label>
                <input
                  type="text"
                  value={modalForm.code}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, code: e.target.value })
                  }
                  placeholder="BRIDAL20"
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm uppercase focus:border-rose focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={modalForm.valid_until}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, valid_until: e.target.value })
                  }
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Banner Image URL
              </label>
              <input
                type="url"
                value={modalForm.image_url}
                onChange={(e) =>
                  setModalForm({ ...modalForm, image_url: e.target.value })
                }
                placeholder="https://..."
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Description
              </label>
              <textarea
                rows={3}
                value={modalForm.description}
                onChange={(e) =>
                  setModalForm({ ...modalForm, description: e.target.value })
                }
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-espresso">
              <input
                type="checkbox"
                checked={modalForm.is_active}
                onChange={(e) =>
                  setModalForm({ ...modalForm, is_active: e.target.checked })
                }
                className="rounded-sm border-champagne text-rose focus:ring-rose"
              />
              Active Offer
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
                {saveMutation.isPending ? 'Saving...' : 'Save Offer'}
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
        title="Delete Offer"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

