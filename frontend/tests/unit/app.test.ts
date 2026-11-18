import { describe, it, expect, vi, afterEach } from 'vitest';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/services/api-client';
import {
  NAV_ITEMS,
  SERVICE_CATEGORIES,
  BRIDAL_SERVICES,
  SAMPLE_PACKAGES,
  SAMPLE_BLOG_POSTS,
  BOOKING_SERVICES,
  AVAILABLE_TIMES,
  BUSINESS_INFO,
} from '@/constants';

describe('cn utility', () => {
  it('merges conditional classes and resolves Tailwind conflicts', () => {
    const isHidden = false;
    expect(cn('px-4 py-2', isHidden && 'hidden', 'px-6')).toBe('py-2 px-6');
  });
});

describe('site constants integrity', () => {
  it('defines navigation items and 9 service dropdown links', () => {
    const servicesNav = NAV_ITEMS.find((item) => item.label === 'Services');
    expect(servicesNav?.children).toHaveLength(9);
  });

  it('defines service categories with unique slugs and non-empty booking options', () => {
    const slugs = SERVICE_CATEGORIES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(BRIDAL_SERVICES.length).toBeGreaterThan(0);
    expect(SAMPLE_PACKAGES.length).toBeGreaterThan(0);
    expect(SAMPLE_BLOG_POSTS.length).toBeGreaterThan(0);
    expect(BOOKING_SERVICES.length).toBeGreaterThan(0);
    expect(AVAILABLE_TIMES.length).toBeGreaterThan(0);
    expect(BUSINESS_INFO.name).toBe('Pooja Makeover');
  });
});

describe('apiRequest helper', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns parsed JSON on a successful response', async () => {
    const mockData = { status: 'ok' };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
      })
    );

    const res = await apiRequest<{ status: string }>('/health');
    expect(res).toEqual(mockData);
  });

  it('throws on a non-OK HTTP status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
      })
    );

    await expect(apiRequest('/appointments')).rejects.toThrow(
      'API request failed: 422'
    );
  });
});
