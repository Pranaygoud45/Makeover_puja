import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { BUSINESS_INFO } from '@/constants';
import { adminApiRequest } from '@/admin/lib/api';
import type { BusinessSettingsForm } from '@/admin/types';

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<BusinessSettingsForm>({
    name: BUSINESS_INFO.name,
    tagline: BUSINESS_INFO.tagline,
    phone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
    address: BUSINESS_INFO.address,
    city: BUSINESS_INFO.city,
    state: BUSINESS_INFO.state,
    pincode: BUSINESS_INFO.pincode,
    googleMapsUrl: BUSINESS_INFO.googleMapsUrl,
    whatsappNumber: BUSINESS_INFO.whatsappNumber,
    instagramUrl: BUSINESS_INFO.instagramUrl,
    facebookUrl: BUSINESS_INFO.facebookUrl,
    businessHours: BUSINESS_INFO.businessHours,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      try {
        return await adminApiRequest<
          Partial<BusinessSettingsForm> | Record<string, string>
        >('/settings');
      } catch {
        return null;
      }
    },
  });

  useEffect(() => {
    if (!settingsData) return;
    setForm((prev) => {
      const next = { ...prev };
      const record = settingsData as Record<string, unknown>;
      if (typeof record.name === 'string') next.name = record.name;
      if (typeof record.tagline === 'string') next.tagline = record.tagline;
      if (typeof record.phone === 'string') next.phone = record.phone;
      if (typeof record.email === 'string') next.email = record.email;
      if (typeof record.address === 'string') next.address = record.address;
      if (typeof record.city === 'string') next.city = record.city;
      if (typeof record.state === 'string') next.state = record.state;
      if (typeof record.pincode === 'string') next.pincode = record.pincode;
      if (typeof record.googleMapsUrl === 'string')
        next.googleMapsUrl = record.googleMapsUrl;
      if (typeof record.google_maps_url === 'string')
        next.googleMapsUrl = record.google_maps_url;
      if (typeof record.whatsappNumber === 'string')
        next.whatsappNumber = record.whatsappNumber;
      if (typeof record.whatsapp_number === 'string')
        next.whatsappNumber = record.whatsapp_number;
      if (typeof record.instagramUrl === 'string')
        next.instagramUrl = record.instagramUrl;
      if (typeof record.instagram_url === 'string')
        next.instagramUrl = record.instagram_url;
      if (typeof record.facebookUrl === 'string')
        next.facebookUrl = record.facebookUrl;
      if (typeof record.facebook_url === 'string')
        next.facebookUrl = record.facebook_url;

      const rawHours = record.businessHours ?? record.business_hours;
      if (Array.isArray(rawHours)) {
        next.businessHours = rawHours as BusinessSettingsForm['businessHours'];
      } else if (typeof rawHours === 'string' && rawHours.trim()) {
        try {
          const parsed = JSON.parse(rawHours);
          if (Array.isArray(parsed)) next.businessHours = parsed;
        } catch {
          /* keep default hours */
        }
      }
      return next;
    });
  }, [settingsData]);

  const saveMutation = useMutation({
    mutationFn: (payload: BusinessSettingsForm) =>
      adminApiRequest('/settings', {
        method: 'PUT',
        body: JSON.stringify({
          settings: {
            ...payload,
            businessHours: JSON.stringify(payload.businessHours),
          },
        }),
      }),
    onSuccess: () => {
      setSaveError(null);
      setSaveSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      setTimeout(() => setSaveSuccess(false), 3500);
    },
    onError: () => {
      setSaveSuccess(false);
      setSaveError('Failed to save business settings.');
    },
  });

  const handleHourChange = (
    index: number,
    field: 'open' | 'close' | 'isClosed',
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      businessHours: prev.businessHours.map((h, i) =>
        i === index ? { ...h, [field]: value } : h
      ),
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-48 animate-pulse rounded-lg bg-white" />
        <div className="h-48 animate-pulse rounded-lg bg-white" />
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveMutation.mutate(form);
      }}
      className="space-y-6"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-espresso">
            Business Settings
          </h2>
          <p className="text-sm text-espresso/60">
            Update salon contact information, opening hours, and social profiles.
          </p>
        </div>

        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="inline-flex items-center gap-2 self-start rounded-sm bg-espresso px-5 py-2.5 text-sm font-medium text-white hover:bg-espresso-light disabled:opacity-50 sm:self-auto"
        >
          <Save className="h-4 w-4" />
          {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Business settings updated successfully.</span>
        </div>
      )}

      {saveError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* General Business Info */}
      <div className="rounded-lg border border-champagne/70 bg-white p-6 shadow-xs">
        <h3 className="mb-4 font-display text-lg font-semibold text-espresso">
          Salon Details
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso">
              Tagline
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso">
              Phone Number *
            </label>
            <input
              type="text"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso">
              Contact Email *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-espresso">
              Street Address *
            </label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso">
              City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                State
              </label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-espresso">
                Pincode
              </label>
              <input
                type="text"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-lg border border-champagne/70 bg-white p-6 shadow-xs">
        <h3 className="mb-4 font-display text-lg font-semibold text-espresso">
          Social Media &amp; Maps
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso">
              WhatsApp Number (with country code, digits only)
            </label>
            <input
              type="text"
              value={form.whatsappNumber}
              onChange={(e) =>
                setForm({ ...form, whatsappNumber: e.target.value })
              }
              placeholder="919876543210"
              className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso">
              Google Maps URL
            </label>
            <input
              type="url"
              value={form.googleMapsUrl}
              onChange={(e) =>
                setForm({ ...form, googleMapsUrl: e.target.value })
              }
              className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso">
              Instagram URL
            </label>
            <input
              type="url"
              value={form.instagramUrl}
              onChange={(e) =>
                setForm({ ...form, instagramUrl: e.target.value })
              }
              className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso">
              Facebook URL
            </label>
            <input
              type="url"
              value={form.facebookUrl}
              onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
              className="w-full rounded-sm border border-champagne px-3 py-2 text-sm focus:border-rose focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="rounded-lg border border-champagne/70 bg-white p-6 shadow-xs">
        <h3 className="mb-4 font-display text-lg font-semibold text-espresso">
          Opening Hours
        </h3>
        <div className="divide-y divide-champagne/50">
          {form.businessHours.map((item, idx) => (
            <div
              key={item.day}
              className="flex flex-col justify-between gap-3 py-3 sm:flex-row sm:items-center"
            >
              <span className="w-28 text-sm font-medium text-espresso">
                {item.day}
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  disabled={item.isClosed}
                  value={item.open}
                  onChange={(e) =>
                    handleHourChange(idx, 'open', e.target.value)
                  }
                  className="w-28 rounded-sm border border-champagne px-2.5 py-1.5 text-xs disabled:bg-ivory disabled:opacity-50"
                />
                <span className="text-xs text-espresso/60">to</span>
                <input
                  type="text"
                  disabled={item.isClosed}
                  value={item.close}
                  onChange={(e) =>
                    handleHourChange(idx, 'close', e.target.value)
                  }
                  className="w-28 rounded-sm border border-champagne px-2.5 py-1.5 text-xs disabled:bg-ivory disabled:opacity-50"
                />
                <label className="ml-2 flex items-center gap-1.5 text-xs text-espresso">
                  <input
                    type="checkbox"
                    checked={item.isClosed}
                    onChange={(e) =>
                      handleHourChange(idx, 'isClosed', e.target.checked)
                    }
                    className="rounded-sm border-champagne text-rose focus:ring-rose"
                  />
                  Closed
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}

