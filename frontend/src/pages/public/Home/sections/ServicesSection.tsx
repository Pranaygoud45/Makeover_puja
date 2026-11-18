import { Link } from 'react-router-dom';
import { SERVICE_CATEGORIES } from '@/constants';

export default function ServicesSection() {
  const categories = SERVICE_CATEGORIES.slice(0, 8);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="section-label">OUR EXPERTISE</p>
          <h2 className="section-title">Beauty Services, Thoughtfully Curated.</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/services/${cat.slug}`}
              className="group block"
            >
              <article>
                {/* Image */}
                <div className="aspect-[3/4] overflow-hidden bg-champagne">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="mt-4">
                  <h3 className="font-display text-lg text-espresso">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-taupe font-body line-clamp-2">
                    {cat.description}
                  </p>
                  <span className="mt-3 inline-block text-xs font-medium uppercase tracking-wide text-rose transition-colors duration-300 group-hover:text-rose-dark font-body">
                    Explore Service &rarr;
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
