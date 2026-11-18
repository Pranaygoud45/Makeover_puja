import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import {
  adminApiRequest,
  extractItems,
  formatDate,
  slugify,
} from '@/admin/lib/api';
import type { AdminBlogPost } from '@/admin/types';
import DataTable, { type Column } from '@/admin/components/DataTable';
import StatusBadge from '@/admin/components/StatusBadge';
import Modal, { ConfirmDialog } from '@/admin/components/Modal';

interface BlogFormState {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  tagsText: string;
  read_time: string;
  is_published: boolean;
}

export default function AdminBlogPage() {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalForm, setModalForm] = useState<BlogFormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminBlogPost | null>(null);

  const { data: posts = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const res = await adminApiRequest<
        AdminBlogPost[] | { items: AdminBlogPost[] }
      >('/blog/admin?page_size=100');
      return extractItems(res);
    },
  });

  const saveMutation = useMutation({
    mutationFn: (form: BlogFormState) => {
      const tags = form.tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt || null,
        content: form.content || null,
        image_url: form.image_url || null,
        author: form.author || 'Pooja Makeover',
        tags,
        read_time: form.read_time ? Number(form.read_time) : 5,
        is_published: form.is_published,
        published_at: form.is_published ? new Date().toISOString() : null,
      };

      if (form.id) {
        return adminApiRequest(`/blog/${form.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      return adminApiRequest('/blog', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      setErrorMsg(null);
      setModalForm(null);
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
    },
    onError: () => setErrorMsg('Failed to save blog post.'),
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, is_published }: { id: string; is_published: boolean }) =>
      adminApiRequest(`/blog/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          is_published,
          published_at: is_published ? new Date().toISOString() : null,
        }),
      }),
    onSuccess: () => {
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
    },
    onError: () => setErrorMsg('Failed to update publish status.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      adminApiRequest(`/blog/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      setErrorMsg(null);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
    },
    onError: () => {
      setErrorMsg('Failed to delete blog post.');
      setDeleteTarget(null);
    },
  });

  const columns: Column<AdminBlogPost>[] = [
    {
      key: 'title',
      header: 'Article',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image_url && (
            <img
              src={row.image_url}
              alt={row.title}
              className="h-10 w-14 shrink-0 rounded-sm object-cover border border-champagne"
            />
          )}
          <div className="min-w-0">
            <p className="font-medium text-espresso">{row.title}</p>
            <p className="text-xs text-espresso/60">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {(row.tags ?? []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-sm bg-ivory px-2 py-0.5 text-xs text-espresso/80 border border-champagne/60"
            >
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'is_published',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <StatusBadge
          status={row.is_published ? 'published' : 'draft'}
          label={row.is_published ? 'Published' : 'Draft'}
        />
      ),
    },
    {
      key: 'published_at',
      header: 'Published',
      render: (row) => (
        <span className="text-xs text-espresso/60">
          {formatDate(row.published_at || row.created_at)}
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
              togglePublishMutation.mutate({
                id: row.id,
                is_published: !row.is_published,
              })
            }
            disabled={togglePublishMutation.isPending}
            className="inline-flex items-center gap-1 rounded-sm border border-champagne px-2 py-1 text-xs font-medium text-espresso hover:bg-ivory"
            title={row.is_published ? 'Unpublish (Draft)' : 'Publish'}
          >
            {row.is_published ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                Draft
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                Publish
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              setModalForm({
                id: row.id,
                title: row.title,
                slug: row.slug,
                excerpt: row.excerpt ?? '',
                content: row.content ?? '',
                image_url: row.image_url ?? '',
                author: row.author ?? 'Pooja Makeover',
                tagsText: (row.tags ?? []).join(', '),
                read_time: row.read_time ? String(row.read_time) : '5',
                is_published: row.is_published,
              })
            }
            className="rounded-sm p-1.5 text-espresso/70 hover:bg-ivory hover:text-espresso"
            title="Edit post"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="rounded-sm p-1.5 text-red-600/80 hover:bg-red-50 hover:text-red-700"
            title="Delete post"
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
            Beauty Blog Posts
          </h2>
          <p className="text-sm text-espresso/60">
            Write and publish skincare, bridal, and hair care articles.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setModalForm({
              title: '',
              slug: '',
              excerpt: '',
              content: '',
              image_url: '',
              author: 'Pooja Makeover',
              tagsText: '',
              read_time: '5',
              is_published: false,
            })
          }
          className="inline-flex items-center gap-2 self-start rounded-sm bg-rose px-4 py-2 text-sm font-medium text-white hover:bg-rose-dark sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      {(isError || errorMsg) && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg ?? 'Failed to load blog posts.'}</span>
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
        data={posts}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="No blog articles yet."
      />

      <Modal
        isOpen={Boolean(modalForm)}
        onClose={() => setModalForm(null)}
        title={modalForm?.id ? 'Edit Blog Post' : 'Create Blog Post'}
        size="xl"
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
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setModalForm({
                      ...modalForm,
                      title,
                      slug: modalForm.id ? modalForm.slug : slugify(title),
                    });
                  }}
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
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
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Cover Image URL
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
                  Author
                </label>
                <input
                  type="text"
                  value={modalForm.author}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, author: e.target.value })
                  }
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Read Time (mins)
                </label>
                <input
                  type="number"
                  min={1}
                  value={modalForm.read_time}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, read_time: e.target.value })
                  }
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={modalForm.tagsText}
                onChange={(e) =>
                  setModalForm({ ...modalForm, tagsText: e.target.value })
                }
                placeholder="bridal, skincare, beauty tips"
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Excerpt
              </label>
              <textarea
                rows={2}
                value={modalForm.excerpt}
                onChange={(e) =>
                  setModalForm({ ...modalForm, excerpt: e.target.value })
                }
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Content
              </label>
              <textarea
                rows={6}
                value={modalForm.content}
                onChange={(e) =>
                  setModalForm({ ...modalForm, content: e.target.value })
                }
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-espresso">
              <input
                type="checkbox"
                checked={modalForm.is_published}
                onChange={(e) =>
                  setModalForm({ ...modalForm, is_published: e.target.checked })
                }
                className="rounded-sm border-champagne text-rose focus:ring-rose"
              />
              Publish immediately
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
                {saveMutation.isPending ? 'Saving...' : 'Save Post'}
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
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

