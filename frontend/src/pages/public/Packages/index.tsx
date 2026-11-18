import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SAMPLE_PACKAGES } from '@/constants';
import type { PackageCategory } from '@/types';
import PackageCard from '@/components/common/PackageCard';

const PACKAGE_FILTERS: { label: string; value: PackageCategory | 'all' }[] = [
  { label: 'All Packages', value: 'all' },
  { label: 'Bridal', value: 'bridal' },
  { label: 'Pre-Bridal', value: 'pre-bridal' },
  { label: 'Hair Care', value: 'hair-care' },
  { label: 'Skin Care', value: 'skin-care' },
  { label: 'Party Makeup', value: 'party-makeup' },
];

export default function Packages() {
  const [selectedCategory, setSelectedCategory] = useState<PackageCategory | 'all'>('all');

  useEffect(() => {
    document.title = 'Beauty Packages | Pooja Makeover';
  }, []);

  const filteredPackages =
    selectedCategory === 'all'
      ? SAMPLE_PACKAGES
      : SAMPLE_PACKAGES.filter((pkg) => pkg.category === selectedCategory);

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="bg-ivory section-padding text-center">
        <div className="container-custom">
          <p className="section-label">Curated Bundles</p>
          <h1 className="section-title">Beauty Packages</h1>
          <p className="section-subtitle mx-auto text-center">
            Thoughtfully combined beauty and grooming packages designed for
            weddings, celebrations, and complete self-care.
          </p>
        </div>
      </section>

      {/* ===== Filter & Packages Grid ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Category Filter Tabs */}
          <div
            className="mb-12 flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label="Package category filter"
          >
            {PACKAGE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={selectedCategory === filter.value}
                onClick={() => setSelectedCategory(filter.value)}
                className={cn(
                  'px-5 py-2.5 font-body text-xs font-medium uppercase tracking-wide transition-colors duration-300',
                  selectedCategory === filter.value
                    ? 'bg-rose text-white'
                    : 'bg-ivory text-espresso hover:bg-champagne'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {filteredPackages.length === 0 ? (
            <div className="py-16 text-center font-body text-taupe">
              No packages available in this category right now. Please contact us
              for a custom bundle.
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== Custom Package CTA ===== */}
      <section className="section-padding bg-ivory text-center">
        <div className="container-custom max-w-2xl">
          <p className="section-label">Customised For You</p>
          <h2 className="font-display text-display-sm md:text-display-md text-espresso">
            Need a Bespoke Beauty Package?
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-taupe">
            Every skin type, hair goal, and wedding timeline is unique. Tell us
            what you have in mind and we will tailor a package to suit your
            schedule and budget.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/book-appointment" className="btn-rose">
              Book Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
