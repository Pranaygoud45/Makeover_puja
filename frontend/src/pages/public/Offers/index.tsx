import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BadgePercent, Calendar, Sparkles } from 'lucide-react';
import { apiRequest } from '@/services/api-client';
import type { Offer } from '@/types';
import SectionHeader from '@/components/ui/SectionHeader';

interface BackendOffer {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  valid_until?: string | null;
  code?: string | null;
  is_active?: boolean;
}

interface BackendOffersResponse {
  items: BackendOffer[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

const DEFAULT_OFFER_IMAGE =
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80';

const FALLBACK_OFFERS: Offer[] = [
  {
    id: 'offer-bridal-glow',
    title: 'Early Bird Bridal & Pre-Bridal Privilege',
    description:
      'Reserve your Bridal Makeup and Pre-Bridal Glow Package together at least 60 days ahead and enjoy a complimentary bridal trial session and touch-up kit.',
    image: DEFAULT_OFFER_IMAGE,
    validUntil: 'Seasonal Offer',
    code: 'BRIDEGLOW',
  },
  {
    id: 'offer-skin-hair',
    title: 'Radiant Skin & Hair Spa Ritual',
    description:
      'Pair our Signature Glow Facial with a Deep Nourishing Hair Spa treatment on weekday appointments for a rejuvenating studio retreat.',
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    validUntil: 'Mon – Thu Appointments',
    code: 'WEEKDAYGLOW',
  },
  {
    id: 'offer-party-trio',
    title: 'Festive & Party Group Makeover',
    description:
      'Booking party makeup & hair styling for three or more family members or bridesmaids? Enjoy priority group scheduling and complimentary lash styling.',
    image:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
    validUntil: 'Group Bookings',
    code: 'PARTYGLAM',
  },
];

function mapBackendOffer(item: BackendOffer): Offer {
  return {
    id: item.id,
    title: item.title,
    description: item.description ?? '',
    image: item.image_url || DEFAULT_OFFER_IMAGE,
    validUntil: item.valid_until ?? undefined,
    code: item.code ?? undefined,
  };
}

export default function Offers() {
  useEffect(() => {
    document.title = 'Special Offers | Pooja Makeover';
  }, []);

  const { data } = useQuery<Offer[]>({
    queryKey: ['public-offers'],
    queryFn: async () => {
      const res = await apiRequest<BackendOffersResponse | BackendOffer[]>('/offers');
      const items = Array.isArray(res) ? res : res.items ?? [];
      return items.map(mapBackendOffer);
    },
    retry: false,
  });

  const offers = data && data.length > 0 ? data : FALLBACK_OFFERS;

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="bg-ivory section-padding text-center">
        <div className="container-custom">
          <p className="section-label">Exclusive Privileges</p>
          <h1 className="section-title">Special Offers</h1>
          <p className="section-subtitle mx-auto text-center">
            Discover seasonal studio privileges, bridal booking perks, and
            curated beauty bundles crafted to make your visit extra special.
          </p>
        </div>
      </section>

      {/* ===== Offers Grid ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            label="Limited Time"
            title="Current Studio Offers"
            subtitle="Mention the offer code when submitting your appointment request to avail these privileges."
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <article
                key={offer.id}
                className="group flex flex-col overflow-hidden border border-champagne bg-white transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="relative overflow-hidden bg-champagne">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {offer.code && (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 bg-espresso px-3 py-1 font-body text-xs font-medium uppercase tracking-wider text-white">
                      <BadgePercent className="h-3.5 w-3.5 text-rose-light" />
                      {offer.code}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  {offer.validUntil && (
                    <p className="mb-2 flex items-center gap-1.5 font-body text-xs uppercase tracking-wider text-rose">
                      <Calendar className="h-3.5 w-3.5" />
                      {offer.validUntil}
                    </p>
                  )}

                  <h3 className="font-display text-xl text-espresso">
                    {offer.title}
                  </h3>

                  <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-taupe">
                    {offer.description}
                  </p>

                  <div className="mt-6 border-t border-champagne/60 pt-4">
                    <Link
                      to="/book-appointment"
                      className="inline-flex items-center gap-2 font-body text-sm font-medium text-rose hover:text-rose-dark transition-colors"
                    >
                      <Sparkles className="h-4 w-4" />
                      Book With This Offer
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section-padding bg-ivory text-center">
        <div className="container-custom max-w-2xl">
          <h2 className="font-display text-display-sm text-espresso">
            Planning a Bridal or Group Booking?
          </h2>
          <p className="mt-3 font-body text-taupe">
            Speak with our studio team for customised multi-ceremony quotes and
            priority date reservations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/book-appointment" className="btn-rose">
              Request Appointment
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact Studio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
