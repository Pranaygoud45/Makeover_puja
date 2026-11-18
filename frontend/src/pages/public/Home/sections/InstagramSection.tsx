import { GALLERY_IMAGES, BUSINESS_INFO } from '@/constants';
import { Instagram } from 'lucide-react';

export default function InstagramSection() {
  const images = GALLERY_IMAGES.slice(0, 6);

  return (
    <section className="py-16 md:py-20 lg:py-26 bg-ivory">
      <div className="container-custom mb-10">
        <p className="section-label">FOLLOW US</p>
        <h2 className="section-title">Follow Our Beauty Journey.</h2>
      </div>

      {/* Edge-to-edge grid */}
      <div className="grid grid-cols-3 gap-1 md:grid-cols-6">
        {images.map((img) => (
          <a
            key={img.id}
            href={BUSINESS_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden bg-champagne"
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-110"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-espresso/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Instagram className="h-8 w-8 text-white" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
