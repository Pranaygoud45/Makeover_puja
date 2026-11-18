import { useState } from 'react';
import { cn } from '@/lib/utils';
import { GALLERY_IMAGES } from '@/constants';
import type { GalleryCategory } from '@/types';
import Lightbox from '@/components/ui/Lightbox';

const FILTERS: { label: string; value: GalleryCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Bridal', value: 'bridal' },
  { label: 'Party', value: 'party' },
  { label: 'Hairstyle', value: 'hairstyle' },
  { label: 'Makeup', value: 'makeup' },
];

export default function PortfolioSection() {
  const [active, setActive] = useState<GalleryCategory | 'all'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    active === 'all'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === active);

  const handlePrev = () => {
    if (lightboxIndex === null || filtered.length === 0) return;
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev - 1 + filtered.length) % filtered.length
    );
  };

  const handleNext = () => {
    if (lightboxIndex === null || filtered.length === 0) return;
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev + 1) % filtered.length
    );
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <p className="section-label">OUR WORK</p>
          <h2 className="section-title">The Art of Transformation.</h2>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setActive(f.value);
                setLightboxIndex(null);
              }}
              className={cn(
                'px-5 py-2 text-xs font-medium uppercase tracking-wide transition-colors duration-300 font-body',
                active === f.value
                  ? 'bg-rose text-white'
                  : 'bg-champagne/50 text-espresso hover:bg-champagne'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Masonry grid via CSS columns */}
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
          {filtered.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              className="mb-4 block w-full break-inside-avoid overflow-hidden bg-champagne text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
              aria-label={`View ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className={cn(
                  'w-full object-cover transition-transform duration-600 hover:scale-105 cursor-pointer',
                  idx % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        images={filtered}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
}
