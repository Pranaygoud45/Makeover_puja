import { Link } from 'react-router-dom';

export default function BrandIntroSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Left — Image */}
          <div className="overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80"
              alt="Pooja Makeover salon experience"
              loading="lazy"
              className="h-full w-full object-cover aspect-[4/5]"
            />
          </div>

          {/* Right — Text content */}
          <div className="flex flex-col justify-center">
            <h2 className="section-title text-balance">
              Where Beauty Meets Confidence.
            </h2>

            <div className="divider mt-6" />

            <div className="mt-8 space-y-5 text-base leading-relaxed text-taupe font-body">
              <p>
                At Pooja Makeover, we believe that true beauty is about feeling
                confident and comfortable in your own skin. Our salon is more than
                a destination — it's a space where every detail is crafted to
                celebrate your individuality.
              </p>
              <p>
                With years of experience in professional beauty care, our team of
                skilled artists delivers personalized services that cater to your
                unique style and preferences. From bridal makeovers to everyday
                grooming, we approach every client with warmth and dedication.
              </p>
              <p>
                We use only premium, trusted products and stay at the forefront of
                beauty trends, ensuring that every visit leaves you feeling
                refreshed, radiant, and ready to take on the world.
              </p>
            </div>

            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-espresso transition-colors duration-300 hover:text-rose font-body"
            >
              Learn More About Us
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
