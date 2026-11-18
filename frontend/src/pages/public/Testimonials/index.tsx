import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { SAMPLE_TESTIMONIALS } from '@/constants';
import TestimonialCard from '@/components/common/TestimonialCard';
import SectionHeader from '@/components/ui/SectionHeader';

export default function Testimonials() {
  useEffect(() => {
    document.title = 'Client Testimonials | Pooja Makeover';
  }, []);

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="bg-ivory section-padding text-center">
        <div className="container-custom">
          <p className="section-label">Client Love</p>
          <h1 className="section-title">What Our Clients Say</h1>
          <p className="section-subtitle mx-auto text-center">
            Real stories and reflections from brides and studio guests who
            trusted Pooja Makeover for their special moments.
          </p>
        </div>
      </section>

      {/* ===== Rating Summary Bar ===== */}
      <section className="border-b border-champagne bg-white py-8">
        <div className="container-custom flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star key={idx} className="h-5 w-5 fill-rose text-rose" />
            ))}
          </div>
          <p className="font-body text-sm text-espresso">
            Trusted by brides &amp; beauty enthusiasts across Mumbai for
            personalised care and timeless results.
          </p>
        </div>
      </section>

      {/* ===== Testimonials Grid ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            label="Reviews"
            title="Stories of Radiance & Care"
            subtitle="Every client leaves with a look tailored to their natural features and personal comfort."
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Share Experience / Book CTA ===== */}
      <section className="section-padding bg-ivory text-center">
        <div className="container-custom max-w-2xl">
          <p className="section-label">Your Turn to Shine</p>
          <h2 className="font-display text-display-sm md:text-display-md text-espresso">
            Experience Pooja Makeover Yourself
          </h2>
          <p className="mt-4 font-body text-base text-taupe">
            Already visited our studio? We&apos;d love to hear your feedback. Or
            reserve your next beauty session with our artists today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/book-appointment" className="btn-rose">
              Book Appointment
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn-secondary">
              Share Your Experience
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
