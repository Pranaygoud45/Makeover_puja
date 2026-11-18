import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SAMPLE_PACKAGES } from '@/constants';
import { Check } from 'lucide-react';

export default function PackagesSection() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="section-label">BEAUTY PACKAGES</p>
          <h2 className="section-title">Beauty Experiences Worth Celebrating.</h2>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_PACKAGES.slice(0, 3).map((pkg) => (
            <article
              key={pkg.id}
              className={cn(
                'relative flex flex-col bg-white p-8 transition-shadow duration-300 hover:shadow-lg',
                pkg.isPopular && 'ring-1 ring-rose'
              )}
            >
              {pkg.isPopular && (
                <span className="absolute right-6 top-6 bg-rose px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white font-body">
                  Popular
                </span>
              )}

              <h3 className="font-display text-xl text-espresso">{pkg.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-taupe font-body">
                {pkg.description}
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {pkg.features.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-espresso font-body"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose" />
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className="btn-secondary mt-8 w-full text-center"
              >
                Enquire Now
              </Link>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link to="/packages" className="btn-primary">
            View All Packages
          </Link>
        </div>
      </div>
    </section>
  );
}
