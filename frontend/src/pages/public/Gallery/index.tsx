import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ZoomIn, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GALLERY_IMAGES } from '@/constants';
import type { GalleryCategory } from '@/types';
import Lightbox from '@/components/ui/Lightbox';

const CATEGORY_TABS: { label: string; value: GalleryCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Bridal', value: 'bridal' },
  { label: 'Party', value: 'party' },
  { label: 'Hairstyle', value: 'hairstyle' },
  { label: 'Makeup', value: 'makeup' },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'all'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Makeover Portfolio & Gallery | Pooja Makeover';
  }, []);

  const filteredImages =
    activeCategory === 'all'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === activeCategory);

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev - 1 + filteredImages.length) % filteredImages.length
    );
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev + 1) % filteredImages.length
    );
  };

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="bg-ivory section-padding text-center">
        <div className="container-custom">
          <p className="section-label">Portfolio</p>
          <h1 className="section-title">Our Makeover Portfolio</h1>
          <p className="section-subtitle mx-auto text-center">
            A curated showcase of real brides, party glam transformations, and
            studio hair artistry crafted at Pooja Makeover.
          </p>
        </div>
      </section>

      {/* ===== Filter Tabs & Masonry Grid ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Category Filter Tabs */}
          <div
            className="mb-10 flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label="Gallery category filter"
          >
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={activeCategory === tab.value}
                onClick={() => {
                  setActiveCategory(tab.value);
                  setLightboxIndex(null);
                }}
                className={cn(
                  'px-5 py-2.5 font-body text-xs font-medium uppercase tracking-wide transition-colors duration-300',
                  activeCategory === tab.value
                    ? 'bg-rose text-white'
                    : 'bg-ivory text-espresso hover:bg-champagne'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          {filteredImages.length === 0 ? (
            <div className="py-16 text-center font-body text-taupe">
              No images found in this category yet.
            </div>
          ) : (
            <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
              {filteredImages.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative mb-4 block w-full break-inside-avoid overflow-hidden bg-champagne text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
                  aria-label={`View ${img.alt}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className={cn(
                      'w-full object-cover transition-transform duration-600 group-hover:scale-105',
                      idx % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'
                    )}
                  />
                  <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-espresso/60 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="font-body text-xs font-medium uppercase tracking-wider text-white">
                      {img.alt}
                    </span>
                    <ZoomIn className="h-5 w-5 text-white" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== Lightbox ===== */}
      <Lightbox
        images={filteredImages}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {/* ===== CTA ===== */}
      <section className="section-padding bg-ivory text-center">
        <div className="container-custom">
          <h2 className="font-display text-display-sm text-espresso">
            Inspired for Your Next Look?
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-body text-taupe">
            Bring your favourite inspiration and let our artists customise it
            to your features and occasion.
          </p>
          <div className="mt-8">
            <Link to="/book-appointment" className="btn-rose">
              Book Appointment
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
