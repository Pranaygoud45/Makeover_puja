import { cn } from '@/lib/utils';

export type StatusVariant =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'active'
  | 'inactive'
  | 'published'
  | 'draft'
  | 'approved'
  | 'expired'
  | 'popular';

export interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
  className?: string;
}

const VARIANT_CLASSES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  completed: 'bg-sky-100 text-sky-800 border-sky-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  inactive: 'bg-stone-100 text-stone-600 border-stone-200',
  published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  draft: 'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  expired: 'bg-red-100 text-red-700 border-red-200',
  popular: 'bg-rose/15 text-rose-dark border-rose/30',
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  const colorClasses =
    VARIANT_CLASSES[normalized] ?? 'bg-champagne/60 text-espresso border-champagne';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        colorClasses,
        className
      )}
    >
      {label ?? status}
    </span>
  );
}

export default StatusBadge;

