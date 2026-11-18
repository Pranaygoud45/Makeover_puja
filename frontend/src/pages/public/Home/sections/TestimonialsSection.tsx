import { SAMPLE_TESTIMONIALS } from '@/constants';
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="section-label">CLIENT STORIES</p>
          <h2 className="section-title">
            Beautiful Experiences. Happy Clients.
          </h2>
        </div>

        {/* Cards — horizontally scrollable on mobile, grid on desktop */}
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {SAMPLE_TESTIMONIALS.map((t) => (
            <article
              key={t.id}
              className="flex min-w-[300px] flex-shrink-0 snap-start flex-col border border-champagne p-8 lg:min-w-0"
            >
              <Quote className="mb-4 h-6 w-6 text-rose/40" />

              <p className="flex-1 text-base italic leading-relaxed text-espresso font-body">
                &ldquo;{t.feedback}&rdquo;
              </p>

              {/* Stars */}
              <div className="mt-6 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < t.rating
                        ? 'fill-rose text-rose'
                        : 'fill-champagne text-champagne'
                    )}
                  />
                ))}
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-espresso font-body">
                  {t.name}
                </p>
                <p className="text-xs text-taupe font-body">{t.service}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
