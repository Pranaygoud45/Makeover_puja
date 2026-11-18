import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { Package } from '@/types';

interface PackageCardProps {
  pkg: Package;
  className?: string;
}

export default function PackageCard({ pkg, className }: PackageCardProps) {
  return (
    <article
      className={cn(
        'relative flex flex-col overflow-hidden rounded-sm border border-champagne bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md',
        pkg.isPopular && 'border-rose ring-1 ring-rose/30',
        className
      )}
    >
      {/* Popular badge */}
      {pkg.isPopular && (
        <span className="absolute right-4 top-4 rounded-sm bg-rose px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          Popular
        </span>
      )}

      <h3 className="font-display text-xl font-semibold text-espresso">
        {pkg.name}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-taupe">{pkg.description}</p>

      {/* Feature list */}
      <ul className="mt-6 flex-1 space-y-3">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-espresso/80">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-rose" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-8">
        <Button
          variant={pkg.isPopular ? 'rose' : 'secondary'}
          size="md"
          to="/book-appointment"
          className="w-full"
        >
          Enquire Now
        </Button>
      </div>
    </article>
  );
}
