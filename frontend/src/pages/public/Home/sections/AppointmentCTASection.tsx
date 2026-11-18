import { Link } from 'react-router-dom';

export default function AppointmentCTASection() {
  return (
    <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1400&q=80"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-espresso/80 via-espresso/60 to-espresso/80" />

      {/* Content */}
      <div className="relative z-10 px-6 py-20 text-center">
        <h2 className="font-display text-display-sm md:text-display-md text-white text-balance">
          Your Next Beautiful Moment Starts Here.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-white/80 font-body">
          Let us help you look and feel your best.
        </p>
        <Link
          to="/book-appointment"
          className="mt-10 inline-flex items-center justify-center gap-2 border border-white bg-white px-8 py-3.5 text-sm font-medium uppercase tracking-wide text-espresso transition-all duration-400 hover:bg-transparent hover:text-white font-body"
        >
          Book Your Appointment
        </Link>
      </div>
    </section>
  );
}
