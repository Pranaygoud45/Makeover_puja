import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/constants';
import ServiceCard from '@/components/common/ServiceCard';
import SectionHeader from '@/components/ui/SectionHeader';

export default function Services() {
  useEffect(() => {
    document.title = 'Our Beauty Services | Pooja Makeover';
  }, []);

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="bg-ivory section-padding text-center">
        <div className="container-custom">
          <p className="section-label">Curated Care</p>
          <h1 className="section-title">Our Beauty Services</h1>
          <p className="section-subtitle mx-auto text-center">
            Explore our complete range of hair, skin, bridal, and makeover
            treatments designed to bring out your natural radiance.
          </p>
        </div>
      </section>

      {/* ===== Services Grid ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            label="What We Offer"
            title="Tailored Beauty Experiences"
            subtitle="Select any service category below to view treatments, details, and consultation options."
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SERVICE_CATEGORIES.map((category) => (
              <ServiceCard
                key={category.id}
                name={category.name}
                slug={category.slug}
                description={category.description}
                image={category.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Packages & Bridal Cross-link ===== */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <div className="grid items-center gap-8 border border-champagne bg-white p-8 md:grid-cols-2 md:p-12">
            <div>
              <p className="section-label">Bespoke Combinations</p>
              <h2 className="font-display text-display-sm text-espresso">
                Looking for Complete Packages?
              </h2>
              <p className="mt-3 font-body text-base leading-relaxed text-taupe">
                Save time and enjoy curated multi-service bundles for bridal
                prep, festive celebrations, or seasonal skin and hair care.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link to="/packages" className="btn-primary">
                View Packages
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/book-appointment" className="btn-rose">
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
