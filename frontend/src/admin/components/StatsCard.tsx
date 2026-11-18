import React from 'react';
import { cn } from '@/lib/utils';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: string;
  accent?: 'espresso' | 'rose' | 'amber' | 'emerald' | 'sky';
  className?: string;
}

const ACCENT_CLASSES: Record<NonNullable<StatsCardProps['accent']>, string> = {
  espresso: 'bg-espresso/10 text-espresso',
  rose: 'bg-rose/15 text-rose-dark',
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  sky: 'bg-sky-100 text-sky-700',
};

export function StatsCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  accent = 'rose',
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-champagne/70 bg-white p-5 shadow-xs transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-espresso/60">
            {title}
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-espresso">
            {value}
          </p>
        </div>
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
            ACCENT_CLASSES[accent]
          )}
        >
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-espresso/60">
          {subtitle && <span>{subtitle}</span>}
          {trend && <span className="font-medium text-rose-dark">{trend}</span>}
        </div>
      )}
    </div>
  );
}

export default StatsCard;

