import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { BRIDAL_SERVICES, SAMPLE_TESTIMONIALS } from '@/constants';
import SectionHeader from '@/components/ui/SectionHeader';
import TestimonialCard from '@/components/common/TestimonialCard';

const BRIDAL_HIGHLIGHTS = [
  'Complimentary pre-bridal skin & look consultation',
  'Customised HD, Airbrush, or Traditional finish',
  'Saree/lehenga draping, floral & jewellery setting',
  'Premium long-wear, flash-friendly formulations',
  'Touch-up kit included for wedding ceremonies',
];

export default function BridalMakeup() {
  useEffect(() => {
    document.title = 'Bridal Makeup | Pooja Makeover';
  }, []);

  const bridalTestimonials = SAMPLE_TESTIMONIALS.filter((t) =>
    t.service.toLowerCase().includes('bridal')
  );
  const displayedTestimonials =
    bridalTestimonials.length > 0 ? bridalTestimonials : SAMPLE_TESTIMONIALS;

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="bg-ivory section-padding text-center">
        <div className="container-custom">
          <p className="section-label">Bridal Studio</p>
          <h1 className="section-title">Bridal Makeup by Pooja Makeover</h1>
          <p className="section-subtitle mx-auto text-center">
            From intimate haldi mornings to grand wedding receptions, we craft
            bespoke bridal looks that feel effortlessly you and photograph
            beautifully.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/book-appointment" className="btn-rose">
              Book Bridal Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/packages" className="btn-secondary">
              View Bridal Packages
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Bridal Services Grid ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            label="Signature Looks"
            title="Bridal & Occasion Artistry"
            subtitle="Every ceremony carries its own mood and lighting. Discover our specialised bridal services."
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {BRIDAL_SERVICES.map((service) => (
              <article
                key={service.id}
                className="group flex flex-col overflow-hidden border border-champagne bg-white transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="overflow-hidden bg-champagne">
                  <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl text-espresso">
                    {service.name}
                  </h3>
                  <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-taupe">
                    {service.description}
                  </p>
                  <div className="mt-5 pt-4 border-t border-champagne/60">
                    <Link
                      to="/book-appointment"
                      className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-rose hover:text-rose-dark transition-colors"
                    >
                      Enquire for This Look
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Bridal Experience Split ===== */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="section-label">The Bridal Promise</p>
              <h2 className="font-display text-display-sm md:text-display-md text-espresso">
                Calm, Thoughtful Preparation for Your Big Day
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-espresso/80">
                Your wedding morning should feel serene and joyful. Our bridal
                artists work closely with you weeks ahead to ensure your skin,
                hair, and drape come together seamlessly.
              </p>

              <ul className="mt-6 space-y-3">
                {BRIDAL_HIGHLIGHTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 font-body text-sm text-espresso/90"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-rose" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link to="/book-appointment" className="btn-primary">
                  <Sparkles className="h-4 w-4" />
                  Reserve Your Wedding Date
                </Link>
              </div>
            </div>

            <div className="overflow-hidden bg-champagne">
              <img
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=80"
                alt="Traditional Indian bride portrait"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Bridal Testimonials ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            label="Bride Stories"
            title="Kind Words from Our Brides"
            subtitle="Hear from clients who trusted Pooja Makeover for their most cherished celebrations."
          />

          <div className="grid gap-8 md:grid-cols-3">
            {displayedTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
