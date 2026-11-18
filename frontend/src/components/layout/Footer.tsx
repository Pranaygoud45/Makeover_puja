import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { BUSINESS_INFO, NAV_ITEMS, SERVICE_CATEGORIES } from '@/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-espresso text-white">
      {/* Main footer */}
      <div className="mx-auto max-w-8xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & tagline */}
          <div>
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl font-bold tracking-wide">
                POOJA
              </span>
              <br />
              <span className="font-display text-sm font-light tracking-[0.25em] text-taupe-light">
                MAKEOVER
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-taupe-light">
              {BUSINESS_INFO.tagline}
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-rose"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={BUSINESS_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-rose"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-rose"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-display text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {NAV_ITEMS.filter((item) => !item.children).map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link
                    to={item.href}
                    className="text-sm text-taupe-light transition-colors hover:text-rose-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/book-appointment"
                  className="text-sm text-taupe-light transition-colors hover:text-rose-light"
                >
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 font-display text-lg font-semibold">Services</h3>
            <ul className="space-y-3">
              {SERVICE_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/services/${cat.slug}`}
                    className="text-sm text-taupe-light transition-colors hover:text-rose-light"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & hours */}
          <div>
            <h3 className="mb-4 font-display text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-4 text-sm text-taupe-light">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-rose-light" />
                <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-white">
                  {BUSINESS_INFO.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-rose-light" />
                <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-white">
                  {BUSINESS_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-light" />
                <span>
                  {BUSINESS_INFO.address}, {BUSINESS_INFO.city},{' '}
                  {BUSINESS_INFO.state} — {BUSINESS_INFO.pincode}
                </span>
              </li>
            </ul>

            {/* Business hours */}
            <h4 className="mb-2 mt-6 text-sm font-semibold text-white">
              Business Hours
            </h4>
            <ul className="space-y-1 text-xs text-taupe-light">
              {BUSINESS_INFO.businessHours.map((h) => (
                <li key={h.day} className="flex justify-between">
                  <span>{h.day}</span>
                  <span>{h.isClosed ? 'Closed' : `${h.open} – ${h.close}`}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-8xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-taupe lg:flex-row lg:px-10">
          <span>© {currentYear} Pooja Makeover. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
