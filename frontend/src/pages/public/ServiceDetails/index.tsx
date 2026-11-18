import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock, Sparkles } from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/constants';
import ServiceCard from '@/components/common/ServiceCard';

interface SubServiceItem {
  name: string;
  duration: string;
  description: string;
}

const SUB_SERVICES_BY_SLUG: Record<string, SubServiceItem[]> = {
  'hair-services': [
    {
      name: 'Precision Haircut & Blow Dry',
      duration: '45–60 mins',
      description: 'Face-framing cuts tailored to your hair texture and lifestyle, finished with a smooth salon blow-dry.',
    },
    {
      name: 'Nourishing Hair Spa',
      duration: '60 mins',
      description: 'Deep scalp massage and steam infusion to restore shine, softness, and strength to dry or damaged hair.',
    },
    {
      name: 'Keratin & Smoothening Therapy',
      duration: '2–3 hours',
      description: 'Frizz-taming treatment for sleek, manageable hair that holds its natural movement.',
    },
    {
      name: 'Occasion Hair Styling & Updos',
      duration: '45–75 mins',
      description: 'Soft waves, textured braids, and classic buns crafted to stay secure through celebrations.',
    },
  ],
  'skin-care': [
    {
      name: 'Signature Glow Facial',
      duration: '60 mins',
      description: 'Multi-step cleansing, gentle exfoliation, lymphatic massage, and hydrating mask for luminous skin.',
    },
    {
      name: 'Deep Pore Cleanup',
      duration: '45 mins',
      description: 'Purifying steam and extraction ritual to decongest pores and refresh dull complexions.',
    },
    {
      name: 'De-Tan & Brightening Ritual',
      duration: '45 mins',
      description: 'Soothing botanical therapy designed to even skin tone and restore natural clarity.',
    },
    {
      name: 'Hydra-Boost Sensitive Skin Care',
      duration: '60 mins',
      description: 'Calming barrier-repair facial ideal for delicate, dehydrated, or pre-event skin.',
    },
  ],
  'bridal-makeup': [
    {
      name: 'Traditional Bridal Makeup',
      duration: '2.5 hours',
      description: 'Rich, timeless bridal look complete with intricate eye detailing, hair styling, and outfit draping.',
    },
    {
      name: 'HD Bridal Makeup',
      duration: '2.5 hours',
      description: 'Camera-ready soft-focus finish formulated for high-resolution wedding photography and lighting.',
    },
    {
      name: 'Airbrush Bridal Makeup',
      duration: '2.5 hours',
      description: 'Feather-light, transfer-resistant coverage designed to stay fresh throughout long ceremonies.',
    },
    {
      name: 'Bridal Trial & Consultation',
      duration: '90 mins',
      description: 'Dedicated pre-wedding session to test shades, undertones, and hairstyle harmony.',
    },
  ],
  'party-makeup': [
    {
      name: 'Evening Glam Makeup',
      duration: '75 mins',
      description: 'Luminous base, sculpted eyes, and a statement or soft lip tailored to your evening outfit.',
    },
    {
      name: 'Cocktail & Sangeet Look',
      duration: '90 mins',
      description: 'High-impact shimmer or smokey eye artistry paired with effortless party hair styling.',
    },
    {
      name: 'Reception Elegance',
      duration: '90 mins',
      description: 'Polished, long-wear makeup crafted for stage lighting and reception portraits.',
    },
  ],
  'hair-colouring': [
    {
      name: 'Global Hair Colour',
      duration: '90–120 mins',
      description: 'Rich, ammonia-gentle all-over shade with glossy conditioning finish.',
    },
    {
      name: 'Balayage & Highlights',
      duration: '2–3 hours',
      description: 'Hand-painted dimension for sun-kissed ribbons and seamless grow-out.',
    },
    {
      name: 'Root Touch-Up & Gloss',
      duration: '60 mins',
      description: 'Targeted coverage and shine-enhancing glaze to keep existing colour vibrant.',
    },
  ],
  'manicure-pedicure': [
    {
      name: 'Luxury Spa Manicure',
      duration: '45 mins',
      description: 'Warm soak, cuticle care, exfoliating scrub, relaxing hand massage, and polish.',
    },
    {
      name: 'Relaxing Spa Pedicure',
      duration: '60 mins',
      description: 'Foot soak, heel smoothing, soothing massage, and tidy nail shaping.',
    },
    {
      name: 'Gel Polish & Bridal Nail Art',
      duration: '60–75 mins',
      description: 'Chip-resistant gel finishes, French tips, and subtle custom accents.',
    },
  ],
  'pre-bridal-services': [
    {
      name: 'Multi-Session Facial Course',
      duration: '4 visits',
      description: 'Scheduled skin-prep facials timed ahead of your wedding week for peak radiance.',
    },
    {
      name: 'Full Body Polishing & Spa',
      duration: '90 mins',
      description: 'Gentle exfoliation and nourishing body wrap for soft, glowing skin.',
    },
    {
      name: 'Complete Grooming & Waxing',
      duration: '90 mins',
      description: 'Hygienic waxing, brow shaping, and manicure-pedicure before your festivities.',
    },
  ],
  'makeup-services': [
    {
      name: 'Editorial & Photoshoot Makeover',
      duration: '90 mins',
      description: 'Camera-tested makeup and hair tailored for portraits, maternity, or brand shoots.',
    },
    {
      name: 'Engagement & Haldi/Mehendi Look',
      duration: '90 mins',
      description: 'Fresh, daytime-friendly glow designed to complement floral jewellery and vibrant attire.',
    },
    {
      name: 'Personal Grooming Lesson',
      duration: '2 hours',
      description: 'One-on-one session to master everyday skincare prep and effortless self-makeup.',
    },
  ],
};

const SLUG_ALIAS: Record<string, string> = {
  'facial-cleanup': 'skin-care',
  'hair-styling': 'hair-services',
  'waxing-threading': 'skin-care',
};

export default function ServiceDetails() {
  const { slug } = useParams<{ slug: string }>();
  const resolvedSlug = slug ? SLUG_ALIAS[slug] ?? slug : undefined;
  const category = SERVICE_CATEGORIES.find((c) => c.slug === resolvedSlug);

  useEffect(() => {
    document.title = category
      ? `${category.name} | Pooja Makeover`
      : 'Service Not Found | Pooja Makeover';
  }, [category]);

  if (!category) {
    return (
      <main>
        <section className="bg-ivory section-padding text-center">
          <div className="container-custom max-w-2xl">
            <p className="section-label">404</p>
            <h1 className="section-title">Service Not Found</h1>
            <p className="section-subtitle mx-auto text-center">
              We couldn&apos;t find the service you were looking for. Explore all
              of our beauty services below.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/services" className="btn-primary">
                <ArrowLeft className="h-4 w-4" />
                View All Services
              </Link>
              <Link to="/book-appointment" className="btn-rose">
                Book Appointment
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const subServices = SUB_SERVICES_BY_SLUG[category.slug] ?? [];
  const relatedCategories = SERVICE_CATEGORIES.filter(
    (c) => c.slug !== category.slug
  ).slice(0, 3);

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="bg-ivory section-padding">
        <div className="container-custom">
          <Link
            to="/services"
            className="mb-8 inline-flex items-center gap-2 font-body text-xs font-medium uppercase tracking-widest text-rose hover:text-espresso transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Services
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="section-label">Service Category</p>
              <h1 className="section-title">{category.name}</h1>
              <p className="mt-5 font-body text-base leading-relaxed text-espresso/80 md:text-lg">
                {category.description}
              </p>

              <ul className="mt-6 space-y-2.5 font-body text-sm text-espresso/80">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-rose" />
                  Personalised consultation before every session
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-rose" />
                  Salon-grade, skin-safe professional products
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-rose" />
                  Sanitised tools and serene studio environment
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/book-appointment" className="btn-rose">
                  Book This Service
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="btn-secondary">
                  Ask a Question
                </Link>
              </div>
            </div>

            <div className="overflow-hidden bg-champagne">
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Sub-Services List ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="mb-12 max-w-2xl">
            <p className="section-label">Treatments Included</p>
            <h2 className="font-display text-display-sm md:text-display-md text-espresso">
              Popular {category.name} Options
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {subServices.map((item) => (
              <article
                key={item.name}
                className="flex flex-col justify-between border border-champagne bg-ivory/50 p-8 transition-colors hover:bg-ivory"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl text-espresso">
                      {item.name}
                    </h3>
                    <span className="inline-flex shrink-0 items-center gap-1 bg-white px-3 py-1 font-body text-xs text-taupe border border-champagne">
                      <Clock className="h-3.5 w-3.5 text-rose" />
                      {item.duration}
                    </span>
                  </div>
                  <p className="mt-3 font-body text-sm leading-relaxed text-taupe">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-champagne/60">
                  <Link
                    to="/book-appointment"
                    className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-rose hover:text-rose-dark transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Book Appointment
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Related Services ===== */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="section-label">Explore More</p>
              <h2 className="font-display text-display-sm text-espresso">
                Related Services
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-rose hover:text-espresso transition-colors"
            >
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {relatedCategories.map((rel) => (
              <ServiceCard
                key={rel.id}
                name={rel.name}
                slug={rel.slug}
                description={rel.description}
                image={rel.image}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
