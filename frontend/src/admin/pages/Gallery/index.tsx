import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminApiRequest, extractItems } from '@/admin/lib/api';
import type {
  AdminBeforeAfter,
  AdminGalleryCategory,
  AdminGalleryImage,
} from '@/admin/types';
import Modal, { ConfirmDialog } from '@/admin/components/Modal';
import StatusBadge from '@/admin/components/StatusBadge';

const GALLERY_CATEGORIES: Array<{ label: string; value: AdminGalleryCategory }> = [
  { label: 'Bridal', value: 'bridal' },
  { label: 'Party', value: 'party' },
  { label: 'Hairstyle', value: 'hairstyle' },
  { label: 'Makeup', value: 'makeup' },
];

interface ImageFormState {
  id?: string;
  image_url: string;
  alt_text: string;
  category: AdminGalleryCategory;
  sort_order: number;
  is_active: boolean;
}

interface BeforeAfterFormState {
  id?: string;
  title: string;
  category: string;
  before_image_url: string;
  after_image_url: string;
  is_active: boolean;
}

export default function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const [filterCat, setFilterCat] = useState<'all' | AdminGalleryCategory>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [imageModal, setImageModal] = useState<ImageFormState | null>(null);
  const [pairModal, setPairModal] = useState<BeforeAfterFormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'image' | 'pair';
    id: string;
    label: string;
  } | null>(null);

  const { data: images = [], isLoading: imagesLoading, isError: imagesError } = useQuery({
    queryKey: ['admin-gallery-images'],
    queryFn: async () => {
      const res = await adminApiRequest<
        AdminGalleryImage[] | { items: AdminGalleryImage[] }
      >('/gallery?active_only=false&page_size=100');
      return extractItems(res);
    },
  });

  const { data: beforeAfterPairs = [], isLoading: pairsLoading } = useQuery({
    queryKey: ['admin-gallery-before-after'],
    queryFn: async () => {
      const res = await adminApiRequest<
        AdminBeforeAfter[] | { items: AdminBeforeAfter[] }
      >('/gallery/before-after?active_only=false&page_size=100');
      return extractItems(res);
    },
  });

  const saveImageMutation = useMutation({
    mutationFn: (form: ImageFormState) => {
      const payload = {
        image_url: form.image_url,
        alt_text: form.alt_text || null,
        category: form.category,
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
      };
      if (form.id) {
        return adminApiRequest(`/gallery/${form.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      return adminApiRequest('/gallery', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      setErrorMsg(null);
      setImageModal(null);
      queryClient.invalidateQueries({ queryKey: ['admin-gallery-images'] });
    },
    onError: () => setErrorMsg('Failed to save gallery image.'),
  });

  const savePairMutation = useMutation({
    mutationFn: (form: BeforeAfterFormState) => {
      const payload = {
        title: form.title || null,
        category: form.category || 'bridal',
        before_image_url: form.before_image_url,
        after_image_url: form.after_image_url,
        is_active: form.is_active,
      };
      if (form.id) {
        return adminApiRequest(`/gallery/before-after/${form.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      return adminApiRequest('/gallery/before-after', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      setErrorMsg(null);
      setPairModal(null);
      queryClient.invalidateQueries({ queryKey: ['admin-gallery-before-after'] });
    },
    onError: () => setErrorMsg('Failed to save Before & After transformation.'),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ type, id }: { type: 'image' | 'pair'; id: string }) =>
      adminApiRequest(
        type === 'image' ? `/gallery/${id}` : `/gallery/before-after/${id}`,
        { method: 'DELETE' }
      ),
    onSuccess: () => {
      setErrorMsg(null);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['admin-gallery-images'] });
      queryClient.invalidateQueries({ queryKey: ['admin-gallery-before-after'] });
    },
    onError: () => {
      setErrorMsg('Failed to delete item.');
      setDeleteTarget(null);
    },
  });

  const filteredImages = useMemo(() => {
    if (filterCat === 'all') return images;
    return images.filter((img) => img.category === filterCat);
  }, [images, filterCat]);

  return (
    <div className="space-y-8">
      {/* Gallery Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-espresso">
            Gallery & Transformations
          </h2>
          <p className="text-sm text-espresso/60">
            Manage portfolio photographs and Before &amp; After makeover pairs.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() =>
              setPairModal({
                title: '',
                category: 'bridal',
                before_image_url: '',
                after_image_url: '',
                is_active: true,
              })
            }
            className="inline-flex items-center gap-2 rounded-sm border border-espresso bg-white px-4 py-2 text-sm font-medium text-espresso hover:bg-ivory"
          >
            <Sparkles className="h-4 w-4" />
            Add Before &amp; After
          </button>
          <button
            type="button"
            onClick={() =>
              setImageModal({
                image_url: '',
                alt_text: '',
                category: 'bridal',
                sort_order: images.length,
                is_active: true,
              })
            }
            className="inline-flex items-center gap-2 rounded-sm bg-rose px-4 py-2 text-sm font-medium text-white hover:bg-rose-dark"
          >
            <Plus className="h-4 w-4" />
            Add Image
          </button>
        </div>
      </div>

      {(imagesError || errorMsg) && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg ?? 'Could not load gallery images.'}</span>
        </div>
      )}

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilterCat('all')}
          className={cn(
            'rounded-sm px-3 py-1.5 text-xs font-medium transition-colors',
            filterCat === 'all'
              ? 'bg-espresso text-white'
              : 'border border-champagne bg-white text-espresso hover:bg-ivory'
          )}
        >
          All ({images.length})
        </button>
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setFilterCat(cat.value)}
            className={cn(
              'rounded-sm px-3 py-1.5 text-xs font-medium transition-colors',
              filterCat === cat.value
                ? 'bg-espresso text-white'
                : 'border border-champagne bg-white text-espresso hover:bg-ivory'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {imagesLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 animate-pulse rounded-lg bg-white" />
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="rounded-lg border border-champagne/70 bg-white p-12 text-center">
          <ImageIcon className="mx-auto h-10 w-10 text-taupe" />
          <p className="mt-3 text-sm text-espresso/60">
            No gallery images found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="group overflow-hidden rounded-lg border border-champagne/70 bg-white shadow-xs"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-ivory">
                <img
                  src={img.image_url}
                  alt={img.alt_text || img.category}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute right-2 top-2">
                  <StatusBadge status={img.category} />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <p className="truncate text-xs font-medium text-espresso">
                  {img.alt_text || 'Untitled photo'}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setImageModal({
                        id: img.id,
                        image_url: img.image_url,
                        alt_text: img.alt_text ?? '',
                        category: img.category,
                        sort_order: img.sort_order ?? 0,
                        is_active: img.is_active !== false,
                      })
                    }
                    className="rounded-sm p-1 text-espresso/70 hover:bg-ivory hover:text-espresso"
                    title="Edit image"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget({
                        type: 'image',
                        id: img.id,
                        label: img.alt_text || 'this gallery image',
                      })
                    }
                    className="rounded-sm p-1 text-red-600/80 hover:bg-red-50 hover:text-red-700"
                    title="Delete image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Before & After Section */}
      <div className="space-y-4 border-t border-champagne pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-semibold text-espresso">
              Before &amp; After Transformations
            </h3>
            <p className="text-xs text-espresso/60">
              Side-by-side makeover pairs featured on the gallery page.
            </p>
          </div>
        </div>

        {pairsLoading ? (
          <div className="h-44 animate-pulse rounded-lg bg-white" />
        ) : beforeAfterPairs.length === 0 ? (
          <div className="rounded-lg border border-champagne/70 bg-white p-8 text-center text-sm text-espresso/60">
            No Before &amp; After pairs added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {beforeAfterPairs.map((pair) => (
              <div
                key={pair.id}
                className="overflow-hidden rounded-lg border border-champagne/70 bg-white shadow-xs"
              >
                <div className="grid grid-cols-2 gap-1 bg-ivory p-2">
                  <div className="relative aspect-4/3 overflow-hidden rounded-sm">
                    <img
                      src={pair.before_image_url}
                      alt={`${pair.title || 'Makeover'} before`}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 rounded-sm bg-espresso/80 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                      Before
                    </span>
                  </div>
                  <div className="relative aspect-4/3 overflow-hidden rounded-sm">
                    <img
                      src={pair.after_image_url}
                      alt={`${pair.title || 'Makeover'} after`}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 rounded-sm bg-rose px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                      After
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-espresso">
                      {pair.title || 'Transformation'}
                    </p>
                    <p className="text-xs capitalize text-espresso/60">
                      {pair.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setPairModal({
                          id: pair.id,
                          title: pair.title ?? '',
                          category: pair.category,
                          before_image_url: pair.before_image_url,
                          after_image_url: pair.after_image_url,
                          is_active: pair.is_active !== false,
                        })
                      }
                      className="rounded-sm p-1.5 text-espresso/70 hover:bg-ivory hover:text-espresso"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          type: 'pair',
                          id: pair.id,
                          label: pair.title || 'this transformation pair',
                        })
                      }
                      className="rounded-sm p-1.5 text-red-600/80 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Image Modal */}
      <Modal
        isOpen={Boolean(imageModal)}
        onClose={() => setImageModal(null)}
        title={imageModal?.id ? 'Edit Gallery Image' : 'Add Gallery Image'}
      >
        {imageModal && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveImageMutation.mutate(imageModal);
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Image URL *
              </label>
              <input
                type="url"
                required
                value={imageModal.image_url}
                onChange={(e) =>
                  setImageModal({ ...imageModal, image_url: e.target.value })
                }
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            {imageModal.image_url && (
              <div className="overflow-hidden rounded-md border border-champagne bg-ivory">
                <img
                  src={imageModal.image_url}
                  alt="Preview"
                  className="h-40 w-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Category *
                </label>
                <select
                  value={imageModal.category}
                  onChange={(e) =>
                    setImageModal({
                      ...imageModal,
                      category: e.target.value as AdminGalleryCategory,
                    })
                  }
                  className="w-full rounded-sm border border-champagne bg-white px-3 py-2 text-sm focus:border-rose focus:outline-none"
                >
                  {GALLERY_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={imageModal.sort_order}
                  onChange={(e) =>
                    setImageModal({
                      ...imageModal,
                      sort_order: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Alt Text / Caption
              </label>
              <input
                type="text"
                value={imageModal.alt_text}
                onChange={(e) =>
                  setImageModal({ ...imageModal, alt_text: e.target.value })
                }
                placeholder="e.g. Traditional Bridal Look"
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setImageModal(null)}
                className="rounded-sm border border-champagne px-4 py-2 text-sm font-medium text-espresso hover:bg-ivory"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveImageMutation.isPending}
                className="rounded-sm bg-espresso px-4 py-2 text-sm font-medium text-white hover:bg-espresso-light disabled:opacity-50"
              >
                {saveImageMutation.isPending ? 'Saving...' : 'Save Image'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Before & After Modal */}
      <Modal
        isOpen={Boolean(pairModal)}
        onClose={() => setPairModal(null)}
        title={pairModal?.id ? 'Edit Transformation Pair' : 'Add Before & After Pair'}
      >
        {pairModal && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              savePairMutation.mutate(pairModal);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Title
                </label>
                <input
                  type="text"
                  value={pairModal.title}
                  onChange={(e) =>
                    setPairModal({ ...pairModal, title: e.target.value })
                  }
                  placeholder="e.g. Bridal HD Makeover"
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={pairModal.category}
                  onChange={(e) =>
                    setPairModal({ ...pairModal, category: e.target.value })
                  }
                  placeholder="bridal"
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Before Image URL *
              </label>
              <input
                type="url"
                required
                value={pairModal.before_image_url}
                onChange={(e) =>
                  setPairModal({ ...pairModal, before_image_url: e.target.value })
                }
                placeholder="https://..."
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                After Image URL *
              </label>
              <input
                type="url"
                required
                value={pairModal.after_image_url}
                onChange={(e) =>
                  setPairModal({ ...pairModal, after_image_url: e.target.value })
                }
                placeholder="https://..."
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPairModal(null)}
                className="rounded-sm border border-champagne px-4 py-2 text-sm font-medium text-espresso hover:bg-ivory"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savePairMutation.isPending}
                className="rounded-sm bg-espresso px-4 py-2 text-sm font-medium text-white hover:bg-espresso-light disabled:opacity-50"
              >
                {savePairMutation.isPending ? 'Saving...' : 'Save Pair'}
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
        title="Delete Gallery Item"
        message={`Are you sure you want to delete "${deleteTarget?.label}"?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

