import { Quote, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export default function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <article
      className={cn(
        'flex flex-col rounded-sm border border-champagne bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md',
        className
      )}
    >
      <Quote className="mb-4 h-8 w-8 text-rose/40" />

      <p className="flex-1 text-base leading-relaxed text-espresso/80">
        &ldquo;{testimonial.feedback}&rdquo;
      </p>

      {/* Star rating */}
      <div className="mt-6 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-4 w-4',
              i < testimonial.rating
                ? 'fill-rose text-rose'
                : 'fill-champagne text-champagne'
            )}
          />
        ))}
      </div>

      {/* Customer info */}
      <div className="mt-4 border-t border-champagne pt-4">
        <p className="font-display text-base font-semibold text-espresso">
          {testimonial.name}
        </p>
        <p className="text-sm text-taupe">{testimonial.service}</p>
      </div>
    </article>
  );
}
