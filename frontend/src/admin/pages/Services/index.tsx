import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  FolderPlus,
  Scissors,
  AlertCircle,
  Clock,
} from 'lucide-react';
import {
  adminApiRequest,
  extractItems,
  formatCurrency,
  slugify,
} from '@/admin/lib/api';
import type { AdminService, AdminServiceCategory } from '@/admin/types';
import Modal, { ConfirmDialog } from '@/admin/components/Modal';
import StatusBadge from '@/admin/components/StatusBadge';

interface CategoryFormState {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

interface ServiceFormState {
  id?: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  image_url: string;
  price: string;
  duration: string;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
}

export default function AdminServicesPage() {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [categoryModal, setCategoryModal] = useState<CategoryFormState | null>(null);
  const [serviceModal, setServiceModal] = useState<ServiceFormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'category' | 'service';
    id: string;
    name: string;
  } | null>(null);

  const { data: categories = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-services-categories'],
    queryFn: async () => {
      const res = await adminApiRequest<
        AdminServiceCategory[] | { items: AdminServiceCategory[] }
      >('/services/categories?active_only=false&page_size=100');
      return extractItems(res)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((cat) => ({
          ...cat,
          services: [...(cat.services ?? [])].sort(
            (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
          ),
        }));
    },
  });

  const saveCategoryMutation = useMutation({
    mutationFn: async (form: CategoryFormState) => {
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description || null,
        image_url: form.image_url || null,
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
      };
      if (form.id) {
        return adminApiRequest(`/services/categories/${form.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      return adminApiRequest('/services/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      setErrorMsg(null);
      setCategoryModal(null);
      queryClient.invalidateQueries({ queryKey: ['admin-services-categories'] });
    },
    onError: () => setErrorMsg('Failed to save service category.'),
  });

  const saveServiceMutation = useMutation({
    mutationFn: async (form: ServiceFormState) => {
      const payload = {
        category_id: form.category_id,
        name: form.name,
        slug: form.slug || slugify(form.name),
        short_description: form.short_description || null,
        description: form.description || null,
        image_url: form.image_url || null,
        price: form.price !== '' ? Number(form.price) : null,
        duration: form.duration || null,
        is_popular: form.is_popular,
        is_active: form.is_active,
        sort_order: Number(form.sort_order) || 0,
      };
      if (form.id) {
        return adminApiRequest(`/services/${form.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      return adminApiRequest('/services', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      setErrorMsg(null);
      setServiceModal(null);
      queryClient.invalidateQueries({ queryKey: ['admin-services-categories'] });
    },
    onError: () => setErrorMsg('Failed to save service.'),
  });

  const reorderCategoryMutation = useMutation({
    mutationFn: ({ id, sort_order }: { id: string; sort_order: number }) =>
      adminApiRequest(`/services/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ sort_order }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services-categories'] });
    },
  });

  const reorderServiceMutation = useMutation({
    mutationFn: ({ id, sort_order }: { id: string; sort_order: number }) =>
      adminApiRequest(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ sort_order }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services-categories'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ type, id }: { type: 'category' | 'service'; id: string }) =>
      adminApiRequest(
        type === 'category' ? `/services/categories/${id}` : `/services/${id}`,
        { method: 'DELETE' }
      ),
    onSuccess: () => {
      setErrorMsg(null);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['admin-services-categories'] });
    },
    onError: () => {
      setErrorMsg('Failed to delete item. Make sure no dependent items prevent removal.');
      setDeleteTarget(null);
    },
  });

  const handleMoveCategory = (index: number, direction: -1 | 1) => {
    const target = categories[index];
    const swap = categories[index + direction];
    if (!target || !swap) return;
    const targetOrder = target.sort_order ?? index;
    const swapOrder = swap.sort_order ?? index + direction;
    reorderCategoryMutation.mutate({
      id: target.id,
      sort_order: targetOrder === swapOrder ? index + direction : swapOrder,
    });
    reorderCategoryMutation.mutate({
      id: swap.id,
      sort_order: targetOrder === swapOrder ? index : targetOrder,
    });
  };

  const handleMoveService = (
    services: AdminService[],
    index: number,
    direction: -1 | 1
  ) => {
    const target = services[index];
    const swap = services[index + direction];
    if (!target || !swap) return;
    const targetOrder = target.sort_order ?? index;
    const swapOrder = swap.sort_order ?? index + direction;
    reorderServiceMutation.mutate({
      id: target.id,
      sort_order: targetOrder === swapOrder ? index + direction : swapOrder,
    });
    reorderServiceMutation.mutate({
      id: swap.id,
      sort_order: targetOrder === swapOrder ? index : targetOrder,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-espresso">
            Services & Categories
          </h2>
          <p className="text-sm text-espresso/60">
            Organize beauty service categories, pricing, durations, and display order.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() =>
              setCategoryModal({
                name: '',
                slug: '',
                description: '',
                image_url: '',
                sort_order: categories.length,
                is_active: true,
              })
            }
            className="inline-flex items-center gap-2 rounded-sm border border-espresso bg-white px-4 py-2 text-sm font-medium text-espresso transition-colors hover:bg-ivory"
          >
            <FolderPlus className="h-4 w-4" />
            Add Category
          </button>

          <button
            type="button"
            disabled={categories.length === 0}
            onClick={() =>
              setServiceModal({
                category_id: categories[0]?.id ?? '',
                name: '',
                slug: '',
                short_description: '',
                description: '',
                image_url: '',
                price: '',
                duration: '',
                is_popular: false,
                is_active: true,
                sort_order: 0,
              })
            }
            className="inline-flex items-center gap-2 rounded-sm bg-rose px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-dark disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        </div>
      </div>

      {/* Errors */}
      {(isError || errorMsg) && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg ?? 'Failed to load service categories.'}</span>
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

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-40 animate-pulse rounded-lg border border-champagne/70 bg-white"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-lg border border-champagne/70 bg-white p-12 text-center">
          <Scissors className="mx-auto h-10 w-10 text-taupe" />
          <p className="mt-3 font-medium text-espresso">No service categories yet</p>
          <p className="mt-1 text-sm text-espresso/60">
            Start by adding a category such as Bridal Makeup or Hair Care.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat, catIdx) => (
            <div
              key={cat.id}
              className="overflow-hidden rounded-lg border border-champagne/70 bg-white shadow-xs"
            >
              {/* Category Header */}
              <div className="flex flex-col justify-between gap-4 border-b border-champagne/60 bg-ivory/70 px-5 py-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="h-12 w-12 rounded-md object-cover border border-champagne"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-champagne/60 text-espresso/60">
                      <Scissors className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-display text-lg font-semibold text-espresso">
                        {cat.name}
                      </h3>
                      <StatusBadge
                        status={cat.is_active ? 'active' : 'inactive'}
                      />
                    </div>
                    {cat.description && (
                      <p className="mt-0.5 text-xs text-espresso/70">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    disabled={catIdx === 0}
                    onClick={() => handleMoveCategory(catIdx, -1)}
                    className="rounded-sm p-1.5 text-espresso/60 hover:bg-white hover:text-espresso disabled:opacity-30"
                    title="Move category up"
                    aria-label="Move category up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={catIdx === categories.length - 1}
                    onClick={() => handleMoveCategory(catIdx, 1)}
                    className="rounded-sm p-1.5 text-espresso/60 hover:bg-white hover:text-espresso disabled:opacity-30"
                    title="Move category down"
                    aria-label="Move category down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setServiceModal({
                        category_id: cat.id,
                        name: '',
                        slug: '',
                        short_description: '',
                        description: '',
                        image_url: '',
                        price: '',
                        duration: '',
                        is_popular: false,
                        is_active: true,
                        sort_order: cat.services.length,
                      })
                    }
                    className="inline-flex items-center gap-1 rounded-sm bg-rose/10 px-2.5 py-1.5 text-xs font-medium text-rose-dark hover:bg-rose/20"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Service
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCategoryModal({
                        id: cat.id,
                        name: cat.name,
                        slug: cat.slug,
                        description: cat.description ?? '',
                        image_url: cat.image_url ?? '',
                        sort_order: cat.sort_order ?? 0,
                        is_active: cat.is_active,
                      })
                    }
                    className="rounded-sm p-1.5 text-espresso/70 hover:bg-white hover:text-espresso"
                    title="Edit category"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget({
                        type: 'category',
                        id: cat.id,
                        name: cat.name,
                      })
                    }
                    className="rounded-sm p-1.5 text-red-600/80 hover:bg-red-50 hover:text-red-700"
                    title="Delete category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Services List */}
              {cat.services.length === 0 ? (
                <div className="px-5 py-6 text-center text-sm text-espresso/50">
                  No services added under this category yet.
                </div>
              ) : (
                <div className="divide-y divide-champagne/40">
                  {cat.services.map((svc, svcIdx) => (
                    <div
                      key={svc.id}
                      className="flex flex-col justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-ivory/40 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-espresso">
                            {svc.name}
                          </span>
                          {svc.is_popular && <StatusBadge status="popular" />}
                          {!svc.is_active && <StatusBadge status="inactive" />}
                        </div>
                        {(svc.short_description || svc.description) && (
                          <p className="mt-0.5 truncate text-xs text-espresso/60">
                            {svc.short_description || svc.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-3 text-xs text-espresso/70">
                          {svc.duration && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-taupe" />
                              {svc.duration}
                            </span>
                          )}
                          <span className="font-semibold text-espresso">
                            {formatCurrency(svc.price)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={svcIdx === 0}
                            onClick={() =>
                              handleMoveService(cat.services, svcIdx, -1)
                            }
                            className="rounded-sm p-1 text-espresso/50 hover:bg-ivory hover:text-espresso disabled:opacity-30"
                            title="Move up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={svcIdx === cat.services.length - 1}
                            onClick={() =>
                              handleMoveService(cat.services, svcIdx, 1)
                            }
                            className="rounded-sm p-1 text-espresso/50 hover:bg-ivory hover:text-espresso disabled:opacity-30"
                            title="Move down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setServiceModal({
                                id: svc.id,
                                category_id: svc.category_id || cat.id,
                                name: svc.name,
                                slug: svc.slug,
                                short_description: svc.short_description ?? '',
                                description: svc.description ?? '',
                                image_url: svc.image_url ?? '',
                                price:
                                  svc.price !== null && svc.price !== undefined
                                    ? String(svc.price)
                                    : '',
                                duration: svc.duration ?? '',
                                is_popular: Boolean(svc.is_popular),
                                is_active: svc.is_active !== false,
                                sort_order: svc.sort_order ?? 0,
                              })
                            }
                            className="rounded-sm p-1.5 text-espresso/70 hover:bg-ivory hover:text-espresso"
                            title="Edit service"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget({
                                type: 'service',
                                id: svc.id,
                                name: svc.name,
                              })
                            }
                            className="rounded-sm p-1.5 text-red-600/80 hover:bg-red-50 hover:text-red-700"
                            title="Delete service"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      <Modal
        isOpen={Boolean(categoryModal)}
        onClose={() => setCategoryModal(null)}
        title={categoryModal?.id ? 'Edit Category' : 'Add Service Category'}
      >
        {categoryModal && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveCategoryMutation.mutate(categoryModal);
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={categoryModal.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setCategoryModal({
                    ...categoryModal,
                    name,
                    slug: categoryModal.id ? categoryModal.slug : slugify(name),
                  });
                }}
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={categoryModal.slug}
                  onChange={(e) =>
                    setCategoryModal({ ...categoryModal, slug: e.target.value })
                  }
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={categoryModal.sort_order}
                  onChange={(e) =>
                    setCategoryModal({
                      ...categoryModal,
                      sort_order: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Image URL
              </label>
              <input
                type="url"
                value={categoryModal.image_url}
                onChange={(e) =>
                  setCategoryModal({ ...categoryModal, image_url: e.target.value })
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
                value={categoryModal.description}
                onChange={(e) =>
                  setCategoryModal({
                    ...categoryModal,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-espresso">
              <input
                type="checkbox"
                checked={categoryModal.is_active}
                onChange={(e) =>
                  setCategoryModal({
                    ...categoryModal,
                    is_active: e.target.checked,
                  })
                }
                className="rounded-sm border-champagne text-rose focus:ring-rose"
              />
              Active (visible on website)
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCategoryModal(null)}
                className="rounded-sm border border-champagne px-4 py-2 text-sm font-medium text-espresso hover:bg-ivory"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveCategoryMutation.isPending}
                className="rounded-sm bg-espresso px-4 py-2 text-sm font-medium text-white hover:bg-espresso-light disabled:opacity-50"
              >
                {saveCategoryMutation.isPending ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Service Modal */}
      <Modal
        isOpen={Boolean(serviceModal)}
        onClose={() => setServiceModal(null)}
        title={serviceModal?.id ? 'Edit Service' : 'Add Service'}
        size="lg"
      >
        {serviceModal && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveServiceMutation.mutate(serviceModal);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Category *
                </label>
                <select
                  required
                  value={serviceModal.category_id}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      category_id: e.target.value,
                    })
                  }
                  className="w-full rounded-sm border border-champagne bg-white px-3 py-2 text-sm focus:border-rose focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={serviceModal.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setServiceModal({
                      ...serviceModal,
                      name,
                      slug: serviceModal.id ? serviceModal.slug : slugify(name),
                    });
                  }}
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={serviceModal.slug}
                  onChange={(e) =>
                    setServiceModal({ ...serviceModal, slug: e.target.value })
                  }
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Price (INR)
                </label>
                <input
                  type="number"
                  min={0}
                  step="1"
                  value={serviceModal.price}
                  onChange={(e) =>
                    setServiceModal({ ...serviceModal, price: e.target.value })
                  }
                  placeholder="e.g. 2500"
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Duration
                </label>
                <input
                  type="text"
                  value={serviceModal.duration}
                  onChange={(e) =>
                    setServiceModal({ ...serviceModal, duration: e.target.value })
                  }
                  placeholder="e.g. 60 mins"
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Image URL
                </label>
                <input
                  type="url"
                  value={serviceModal.image_url}
                  onChange={(e) =>
                    setServiceModal({ ...serviceModal, image_url: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={serviceModal.sort_order}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      sort_order: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Short Description
              </label>
              <input
                type="text"
                value={serviceModal.short_description}
                onChange={(e) =>
                  setServiceModal({
                    ...serviceModal,
                    short_description: e.target.value,
                  })
                }
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Full Description
              </label>
              <textarea
                rows={3}
                value={serviceModal.description}
                onChange={(e) =>
                  setServiceModal({
                    ...serviceModal,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-espresso">
                <input
                  type="checkbox"
                  checked={serviceModal.is_popular}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      is_popular: e.target.checked,
                    })
                  }
                  className="rounded-sm border-champagne text-rose focus:ring-rose"
                />
                Mark as Popular
              </label>
              <label className="flex items-center gap-2 text-sm text-espresso">
                <input
                  type="checkbox"
                  checked={serviceModal.is_active}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      is_active: e.target.checked,
                    })
                  }
                  className="rounded-sm border-champagne text-rose focus:ring-rose"
                />
                Active
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setServiceModal(null)}
                className="rounded-sm border border-champagne px-4 py-2 text-sm font-medium text-espresso hover:bg-ivory"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveServiceMutation.isPending}
                className="rounded-sm bg-espresso px-4 py-2 text-sm font-medium text-white hover:bg-espresso-light disabled:opacity-50"
              >
                {saveServiceMutation.isPending ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate({
              type: deleteTarget.type,
              id: deleteTarget.id,
            });
          }
        }}
        title={`Delete ${deleteTarget?.type === 'category' ? 'Category' : 'Service'}`}
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

