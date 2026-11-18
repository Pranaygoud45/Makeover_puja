export default function SalonExperienceSection() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="section-label">OUR SPACE</p>
          <h2 className="section-title">A Salon Built for Your Comfort.</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-12 md:grid-rows-2">
          {/* Large image — spans 7 cols, 2 rows */}
          <div className="md:col-span-7 md:row-span-2 overflow-hidden bg-champagne">
            <img
              src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=900&q=80"
              alt="Pooja Makeover salon interior"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Top-right */}
          <div className="md:col-span-5 overflow-hidden bg-champagne aspect-[4/3] md:aspect-auto">
            <img
              src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&q=80"
              alt="Comfortable salon seating"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Bottom-right split into two */}
          <div className="grid grid-cols-2 gap-6 md:col-span-5">
            <div className="overflow-hidden bg-champagne aspect-square">
              <img
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&q=80"
                alt="Salon products"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="overflow-hidden bg-champagne aspect-square">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80"
                alt="Styling station"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Supporting text */}
        <div className="mt-12 max-w-2xl">
          <p className="text-base leading-relaxed text-taupe font-body">
            Our salon is thoughtfully designed to offer a clean, comfortable and
            welcoming environment. From the moment you walk in, you'll experience
            a space that prioritizes hygiene, personalised attention and a warm
            atmosphere — because your comfort is at the heart of everything we do.
          </p>
        </div>
      </div>
    </section>
  );
}
