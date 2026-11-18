import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VALUE_PROPOSITIONS } from '@/constants';
import SectionHeader from '@/components/ui/SectionHeader';

const STORY_IMAGE =
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000&q=80';

export default function About() {
  useEffect(() => {
    document.title = 'About Us | Pooja Makeover';
  }, []);

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="bg-ivory section-padding text-center">
        <div className="container-custom">
          <p className="section-label">Our Story</p>
          <h1 className="section-title">About Pooja Makeover</h1>
          <p className="section-subtitle mx-auto text-center">
            Where timeless artistry meets modern beauty care — dedicated to
            making every client feel confident, radiant, and truly celebrated.
          </p>
        </div>
      </section>

      {/* ===== Editorial Split Story ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="overflow-hidden bg-champagne">
              <img
                src={STORY_IMAGE}
                alt="Pooja Makeover salon interior and studio"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>

            {/* Editorial Text */}
            <div>
              <p className="section-label">The Journey</p>
              <h2 className="font-display text-display-sm md:text-display-md text-espresso">
                Crafting Confidence Through Personalised Beauty.
              </h2>
              <div className="divider my-6" />
              <div className="space-y-4 font-body text-base leading-relaxed text-espresso/80">
                <p>
                  Founded with a passion for authentic beauty and refined
                  craftsmanship, Pooja Makeover began as an intimate studio built
                  on one belief: beauty services should never feel rushed or
                  one-size-fits-all.
                </p>
                <p>
                  Over the years, our team of experienced makeup artists, hair
                  stylists, and skincare specialists has transformed thousands of
                  brides and everyday clients. Every session starts with a
                  thoughtful consultation to understand your skin, style, and
                  vision.
                </p>
                <p>
                  Whether you are preparing for your wedding day, an upcoming
                  celebration, or simply taking an afternoon to unwind, we blend
                  trusted professional products with gentle care in a serene,
                  welcoming space.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/book-appointment" className="btn-rose">
                  Book a Consultation
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/services" className="btn-secondary">
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Mission & Vision ===== */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <SectionHeader
            label="Purpose & Philosophy"
            title="Our Mission & Vision"
            subtitle="Guided by artistry, hygiene, and heartfelt hospitality in everything we do."
          />

          <div className="grid gap-8 md:grid-cols-3">
            <article className="border border-champagne bg-white p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center bg-ivory text-rose">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl text-espresso mb-3">
                Our Mission
              </h3>
              <p className="font-body text-sm leading-relaxed text-taupe">
                To deliver bespoke makeup, hair, and skincare experiences that
                enhance natural beauty while upholding the highest standards of
                hygiene, warmth, and artistry.
              </p>
            </article>

            <article className="border border-champagne bg-white p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center bg-ivory text-rose">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl text-espresso mb-3">
                Our Vision
              </h3>
              <p className="font-body text-sm leading-relaxed text-taupe">
                To be the most trusted beauty and bridal destination, admired
                for timeless looks, compassionate client care, and a calm studio
                sanctuary.
              </p>
            </article>

            <article className="border border-champagne bg-white p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center bg-ivory text-rose">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl text-espresso mb-3">
                Our Promise
              </h3>
              <p className="font-body text-sm leading-relaxed text-taupe">
                Authentic skin-safe products, transparent consultations, and
                artistry tailored to your features, outfit, and occasion — never
                a generic template.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ===== Value Propositions ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            label="Why Choose Us"
            title="The Pooja Makeover Difference"
            subtitle="Every detail of our studio is designed around your comfort and confidence."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUE_PROPOSITIONS.map((item, idx) => (
              <div
                key={item.title}
                className={cn(
                  'border border-champagne bg-ivory/60 p-8 transition-colors duration-300 hover:bg-ivory'
                )}
              >
                <span className="font-display text-2xl text-rose/60">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-display text-xl text-espresso">
                  {item.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-taupe">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section-padding bg-espresso text-center text-white">
        <div className="container-custom">
          <p className="section-label text-rose-light">Visit Our Studio</p>
          <h2 className="font-display text-display-sm md:text-display-md text-white">
            Ready for Your Transformation?
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-base text-champagne/80">
            Reserve your appointment with our specialists and experience
            personalised beauty care crafted just for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/book-appointment" className="btn-rose">
              Book Appointment
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-champagne/50 px-8 py-3.5 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-espresso"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
