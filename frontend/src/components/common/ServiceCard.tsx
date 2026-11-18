import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import LazyImage from '@/components/ui/LazyImage';

interface ServiceCardProps {
  name: string;
  slug: string;
  description: string;
  image: string;
  className?: string;
}

export default function ServiceCard({
  name,
  slug,
  description,
  image,
  className,
}: ServiceCardProps) {
  return (
    <article
      className={cn(
        'group overflow-hidden rounded-sm border border-champagne bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg',
        className
      )}
    >
      {/* Image with hover zoom */}
      <div className="overflow-hidden">
        <div className="transition-transform duration-500 group-hover:scale-105">
          <LazyImage src={image} alt={name} aspectRatio="4/3" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-espresso">
          {name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-taupe">
          {description}
        </p>
        <Link
          to={`/services/${slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-rose transition-colors hover:text-rose-dark"
        >
          Explore
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
