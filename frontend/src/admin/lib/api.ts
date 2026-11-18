import { apiRequest } from '@/services/api-client';
import { getStoredToken } from '@/hooks/useAuth';
import type { AdminPaginatedResponse } from '@/admin/types';

export function adminApiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const authHeader: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  return apiRequest<T>(path, {
    ...init,
    headers: {
      ...authHeader,
      ...(init?.headers as Record<string, string> | undefined),
    },
  });
}

export function extractItems<T>(
  payload: T[] | AdminPaginatedResponse<T> | { items?: T[]; data?: T[] } | null | undefined
): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if ('items' in payload && Array.isArray(payload.items)) return payload.items;
  if ('data' in payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatCurrency(amount?: number | string | null): string {
  if (amount === null || amount === undefined || amount === '') return '—';
  const num = typeof amount === 'string' ? Number(amount) : amount;
  if (Number.isNaN(num)) return String(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}
