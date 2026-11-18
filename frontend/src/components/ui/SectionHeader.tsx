import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-12',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className
      )}
    >
      {label && (
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-rose">
          {label}
        </span>
      )}
      <h2 className="font-display text-display-sm md:text-display-md text-espresso">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-base text-taupe md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
