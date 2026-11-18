import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, UserCog, AlertCircle } from 'lucide-react';
import { adminApiRequest, extractItems } from '@/admin/lib/api';
import type { AdminStaffMember } from '@/admin/types';
import Modal, { ConfirmDialog } from '@/admin/components/Modal';
import StatusBadge from '@/admin/components/StatusBadge';

interface StaffFormState {
  id?: string;
  name: string;
  role: string;
  specialization: string;
  photo_url: string;
  bio: string;
  sort_order: number;
  is_active: boolean;
}

export default function AdminStaffPage() {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalForm, setModalForm] = useState<StaffFormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminStaffMember | null>(null);

  const { data: staffList = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-staff'],
    queryFn: async () => {
      const res = await adminApiRequest<
        AdminStaffMember[] | { items: AdminStaffMember[] }
      >('/staff?active_only=false&page_size=100');
      return extractItems(res).sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      );
    },
  });

  const saveMutation = useMutation({
    mutationFn: (form: StaffFormState) => {
      const payload = {
        name: form.name,
        role: form.role || null,
        specialization: form.specialization || null,
        photo_url: form.photo_url || null,
        bio: form.bio || null,
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
      };
      if (form.id) {
        return adminApiRequest(`/staff/${form.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      return adminApiRequest('/staff', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      setErrorMsg(null);
      setModalForm(null);
      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
    },
    onError: () => setErrorMsg('Failed to save staff member.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      adminApiRequest(`/staff/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      setErrorMsg(null);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
    },
    onError: () => {
      setErrorMsg('Failed to remove staff member.');
      setDeleteTarget(null);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-espresso">
            Team & Artists
          </h2>
          <p className="text-sm text-espresso/60">
            Manage makeup artists, hair stylists, and skincare specialists.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setModalForm({
              name: '',
              role: '',
              specialization: '',
              photo_url: '',
              bio: '',
              sort_order: staffList.length,
              is_active: true,
            })
          }
          className="inline-flex items-center gap-2 self-start rounded-sm bg-rose px-4 py-2 text-sm font-medium text-white hover:bg-rose-dark sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Team Member
        </button>
      </div>

      {(isError || errorMsg) && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg ?? 'Could not load staff directory.'}</span>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 animate-pulse rounded-lg bg-white" />
          ))}
        </div>
      ) : staffList.length === 0 ? (
        <div className="rounded-lg border border-champagne/70 bg-white p-12 text-center">
          <UserCog className="mx-auto h-10 w-10 text-taupe" />
          <p className="mt-3 text-sm text-espresso/60">
            No staff members added yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {staffList.map((member) => (
            <div
              key={member.id}
              className="flex flex-col justify-between rounded-lg border border-champagne/70 bg-white p-5 shadow-xs"
            >
              <div>
                <div className="flex items-start gap-4">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="h-16 w-16 shrink-0 rounded-full object-cover border border-champagne"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ivory text-lg font-display font-bold text-rose-dark border border-champagne">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate font-display text-lg font-semibold text-espresso">
                        {member.name}
                      </h3>
                      <StatusBadge
                        status={member.is_active ? 'active' : 'inactive'}
                      />
                    </div>
                    {member.role && (
                      <p className="text-xs font-medium text-rose-dark">
                        {member.role}
                      </p>
                    )}
                    {member.specialization && (
                      <p className="mt-0.5 text-xs text-espresso/60">
                        {member.specialization}
                      </p>
                    )}
                  </div>
                </div>

                {member.bio && (
                  <p className="mt-4 text-xs leading-relaxed text-espresso/75 line-clamp-3">
                    {member.bio}
                  </p>
                )}
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-champagne/50 pt-3">
                <button
                  type="button"
                  onClick={() =>
                    setModalForm({
                      id: member.id,
                      name: member.name,
                      role: member.role ?? '',
                      specialization: member.specialization ?? '',
                      photo_url: member.photo_url ?? '',
                      bio: member.bio ?? '',
                      sort_order: member.sort_order ?? 0,
                      is_active: member.is_active !== false,
                    })
                  }
                  className="inline-flex items-center gap-1 rounded-sm border border-champagne px-2.5 py-1.5 text-xs font-medium text-espresso hover:bg-ivory"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(member)}
                  className="inline-flex items-center gap-1 rounded-sm border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={Boolean(modalForm)}
        onClose={() => setModalForm(null)}
        title={modalForm?.id ? 'Edit Team Member' : 'Add Team Member'}
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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.name}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, name: e.target.value })
                  }
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={modalForm.role}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, role: e.target.value })
                  }
                  placeholder="Senior Bridal Makeup Artist"
                  className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  Specialization
                </label>
                <input
                  type="text"
                  value={modalForm.specialization}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, specialization: e.target.value })
                  }
                  placeholder="HD & Airbrush Bridal"
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
                Photo URL
              </label>
              <input
                type="url"
                value={modalForm.photo_url}
                onChange={(e) =>
                  setModalForm({ ...modalForm, photo_url: e.target.value })
                }
                placeholder="https://..."
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Bio
              </label>
              <textarea
                rows={3}
                value={modalForm.bio}
                onChange={(e) =>
                  setModalForm({ ...modalForm, bio: e.target.value })
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
              Active on team page
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
                {saveMutation.isPending ? 'Saving...' : 'Save Member'}
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
        title="Remove Team Member"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from the team?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

