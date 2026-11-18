import { Link } from 'react-router-dom';
import { BRIDAL_SERVICES } from '@/constants';

export default function BridalSection() {
  const featured = BRIDAL_SERVICES[0];
  const rest = BRIDAL_SERVICES.slice(1, 5);

  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="section-label">BRIDAL &amp; SPECIAL OCCASIONS</p>
          <h2 className="section-title">
            Every Celebration Deserves a Beautiful You.
          </h2>
        </div>

        {/* Editorial gallery — 3-column grid with larger featured */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-3 md:grid-rows-2">
          {/* Featured — spans 2 rows on left */}
          <div className="md:row-span-2">
            <article className="group relative h-full overflow-hidden bg-champagne">
              <img
                src={featured.image}
                alt={featured.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/70 to-transparent p-6">
                <h3 className="font-display text-xl text-white">
                  {featured.name}
                </h3>
                <p className="mt-1 text-sm text-white/80 font-body">
                  {featured.description}
                </p>
              </div>
            </article>
          </div>

          {/* Rest — 4 items in 2×2 */}
          {rest.map((item) => (
            <article
              key={item.id}
              className="group relative overflow-hidden bg-champagne aspect-[4/3]"
            >
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/70 to-transparent p-5">
                <h3 className="font-display text-lg text-white">{item.name}</h3>
                <p className="mt-0.5 text-sm text-white/80 font-body line-clamp-2">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <Link to="/bridal-makeup" className="btn-primary">
            Enquire About Bridal Services
          </Link>
        </div>
      </div>
    </section>
  );
}
