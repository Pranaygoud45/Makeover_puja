import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="bg-ivory">
      <div className="container-custom flex min-h-screen flex-col-reverse items-center lg:flex-row lg:gap-16">
        {/* Left — Editorial text */}
        <div className="flex flex-1 flex-col justify-center py-16 lg:py-26">
          <p className="section-label mb-6">POOJA MAKEOVER</p>

          <h1 className="font-display text-display-sm md:text-display-lg lg:text-display-xl text-espresso text-balance">
            Beauty That Feels{' '}
            <span className="italic">Like You.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base md:text-lg leading-relaxed text-taupe font-body">
            Discover professional beauty care, stunning makeovers and
            unforgettable bridal experiences at Pooja Makeover.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/services" className="btn-secondary">
              Explore Our Services
            </Link>
            <Link to="/book-appointment" className="btn-primary">
              Book Your Appointment
            </Link>
          </div>
        </div>

        {/* Right — Hero image */}
        <div className="relative flex-1 self-stretch">
          <div className="h-[50vh] lg:h-full w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&q=80"
              alt="Beautiful woman — Pooja Makeover"
              loading="eager"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
