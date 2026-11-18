import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  PackageOpen,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  adminApiRequest,
  extractItems,
  formatCurrency,
  slugify,
} from '@/admin/lib/api';
import type { AdminPackage } from '@/admin/types';
import Modal, { ConfirmDialog } from '@/admin/components/Modal';
import StatusBadge from '@/admin/components/StatusBadge';

const PACKAGE_CATEGORIES = [
  'bridal',
  'pre-bridal',
  'hair-care',
  'skin-care',
  'party-makeup',
  'seasonal',
];

interface PackageFormState {
  id?: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  featuresText: string;
  price: string;
  image_url: string;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
}

export default function AdminPackagesPage() {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalForm, setModalForm] = useState<PackageFormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminPackage | null>(null);

  const { data: packages = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-packages'],
    queryFn: async () => {
      const res = await adminApiRequest<AdminPackage[] | { items: AdminPackage[] }>(
        '/packages?active_only=false&page_size=100'
      );
      return extractItems(res).sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      );
    },
  });

  const saveMutation = useMutation({
    mutationFn: (form: PackageFormState) => {
      const features = form.featuresText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        category: form.category || null,
        description: form.description || null,
        features,
        price: form.price !== '' ? Number(form.price) : null,
        image_url: form.image_url || null,
        is_popular: form.is_popular,
        is_active: form.is_active,
        sort_order: Number(form.sort_order) || 0,
      };

      if (form.id) {
        return adminApiRequest(`/packages/${form.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      return adminApiRequest('/packages', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      setErrorMsg(null);
      setModalForm(null);
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
    },
    onError: () => setErrorMsg('Failed to save package.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      adminApiRequest(`/packages/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      setErrorMsg(null);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
    },
    onError: () => {
      setErrorMsg('Failed to delete package.');
      setDeleteTarget(null);
    },
  });

  const groupedPackages = useMemo(() => {
    const filtered =
      selectedCategory === 'all'
        ? packages
        : packages.filter((p) => (p.category || 'general') === selectedCategory);

    return filtered.reduce<Record<string, AdminPackage[]>>((acc, pkg) => {
      const key = pkg.category || 'general';
      if (!acc[key]) acc[key] = [];
      acc[key].push(pkg);
      return acc;
    }, {});
  }, [packages, selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-espresso">
            Beauty Packages
          </h2>
          <p className="text-sm text-espresso/60">
            Create bridal, pre-bridal, and seasonal beauty packages by category.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setModalForm({
              name: '',
              slug: '',
              category: 'bridal',
              description: '',
              featuresText: '',
              price: '',
              image_url: '',
              is_popular: false,
              is_active: true,
              sort_order: packages.length,
            })
          }
          className="inline-flex items-center gap-2 self-start rounded-sm bg-rose px-4 py-2 text-sm font-medium text-white hover:bg-rose-dark sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Package
        </button>
      </div>

      {(isError || errorMsg) && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg ?? 'Could not load packages.'}</span>
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

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={cn(
            'rounded-sm px-3 py-1.5 text-xs font-medium transition-colors',
            selectedCategory === 'all'
              ? 'bg-espresso text-white'
              : 'border border-champagne bg-white text-espresso hover:bg-ivory'
          )}
        >
          All Categories ({packages.length})
        </button>
        {PACKAGE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'rounded-sm px-3 py-1.5 text-xs font-medium capitalize transition-colors',
              selectedCategory === cat
                ? 'bg-espresso text-white'
                : 'border border-champagne bg-white text-espresso hover:bg-ivory'
            )}
          >
            {cat.replace('-', ' ')}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 animate-pulse rounded-lg bg-white" />
          ))}
        </div>
      ) : Object.keys(groupedPackages).length === 0 ? (
        <div className="rounded-lg border border-champagne/70 bg-white p-12 text-center">
          <PackageOpen className="mx-auto h-10 w-10 text-taupe" />
          <p className="mt-3 text-sm text-espresso/60">No packages found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedPackages).map(([category, items]) => (
            <section key={category} className="space-y-3">
              <h3 className="font-display text-lg font-semibold capitalize text-espresso">
                {category.replace('-', ' ')} Packages
              </h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {items.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex flex-col justify-between rounded-lg border border-champagne/70 bg-white p-5 shadow-xs"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-display text-lg font-semibold text-espresso">
                            {pkg.name}
                          </h4>
                          <p className="mt-0.5 text-lg font-bold text-rose-dark">
                            {formatCurrency(pkg.price)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {pkg.is_popular && <StatusBadge status="popular" />}
                          {!pkg.is_active && <StatusBadge status="inactive" />}
                        </div>
                      </div>

                      {pkg.description && (
                        <p className="mt-2 text-xs leading-relaxed text-espresso/70">
                          {pkg.description}
                        </p>
                      )}

                      {pkg.features && pkg.features.length > 0 && (
                        <ul className="mt-4 space-y-1.5 border-t border-champagne/50 pt-3">
                          {pkg.features.map((feat, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs text-espresso/80"
                            >
                              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-2 border-t border-champagne/50 pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          setModalForm({
                            id: pkg.id,
                            name: pkg.name,
                            slug: pkg.slug,
                            category: pkg.category ?? 'bridal',
                            description: pkg.description ?? '',
                            featuresText: (pkg.features ?? []).join('\n'),
                            price:
                              pkg.price !== null && pkg.price !== undefined
                                ? String(pkg.price)
                                : '',
                            image_url: pkg.image_url ?? '',
                            is_popular: Boolean(pkg.is_popular),
                            is_active: pkg.is_active !== false,
                            sort_order: pkg.sort_order ?? 0,
                          })
                        }
                        className="inline-flex items-center gap-1 rounded-sm border border-champagne px-2.5 py-1.5 text-xs font-medium text-espresso hover:bg-ivory"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(pkg)}
                        className="inline-flex items-center gap-1 rounded-sm border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <Modal
        isOpen={Boolean(modalForm)}
        onClose={() => setModalForm(null)}
        title={modalForm?.id ? 'Edit Package' : 'Add Package'}
        size="lg"
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
                  Package Name *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setModalForm({
                      ...modalForm,
                      name,
                      slug: modalForm.id ? modalForm.slug : slugify(name),
                    });
                  }}
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Category
                </label>
                <select
                  value={modalForm.category}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, category: e.target.value })
                  }
                  className="w-full rounded-sm border border-champagne bg-white px-3 py-2 text-sm capitalize focus:border-rose focus:outline-none"
                >
                  {PACKAGE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace('-', ' ')}
                    </option>
                  ))}
                </select>
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
                  value={modalForm.slug}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, slug: e.target.value })
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
                  value={modalForm.price}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, price: e.target.value })
                  }
                  placeholder="15000"
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={modalForm.sort_order}
                  onChange={(e) =>
                    setModalForm({
                      ...modalForm,
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
                rows={2}
                value={modalForm.description}
                onChange={(e) =>
                  setModalForm({ ...modalForm, description: e.target.value })
                }
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Included Features (one per line)
              </label>
              <textarea
                rows={4}
                value={modalForm.featuresText}
                onChange={(e) =>
                  setModalForm({ ...modalForm, featuresText: e.target.value })
                }
                placeholder={'HD Bridal Makeup\nHair Styling\nSaree Draping'}
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-espresso">
                <input
                  type="checkbox"
                  checked={modalForm.is_popular}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, is_popular: e.target.checked })
                  }
                  className="rounded-sm border-champagne text-rose focus:ring-rose"
                />
                Popular Badge
              </label>
              <label className="flex items-center gap-2 text-sm text-espresso">
                <input
                  type="checkbox"
                  checked={modalForm.is_active}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, is_active: e.target.checked })
                  }
                  className="rounded-sm border-champagne text-rose focus:ring-rose"
                />
                Active
              </label>
            </div>

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
                {saveMutation.isPending ? 'Saving...' : 'Save Package'}
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
        title="Delete Package"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

