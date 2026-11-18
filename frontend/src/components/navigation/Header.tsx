import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/constants';
import { Button } from '@/components/ui/Button';
import ServicesDropdown from './ServicesDropdown';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const servicesItem = NAV_ITEMS.find((item) => item.label === 'Services');

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-white/95 shadow-md backdrop-blur-sm'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-8xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl font-bold tracking-wide text-espresso">
            POOJA
          </span>
          <span className="font-display text-sm font-light tracking-[0.25em] text-taupe">
            MAKEOVER
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() =>
                item.children && setServicesOpen(true)
              }
              onMouseLeave={() =>
                item.children && setServicesOpen(false)
              }
            >
              <Link
                to={item.href}
                className="text-sm font-medium text-espresso transition-colors hover:text-rose"
              >
                {item.label}
              </Link>
              {item.children && servicesItem && (
                <ServicesDropdown
                  items={servicesItem.children!}
                  isOpen={servicesOpen}
                />
              )}
            </div>
          ))}
        </nav>

        {/* Desktop CTA + mobile hamburger */}
        <div className="flex items-center gap-4">
          <Button
            variant="rose"
            size="sm"
            to="/book-appointment"
            className="hidden lg:inline-flex"
          >
            Book Appointment
          </Button>

          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-sm p-2 text-espresso transition-colors hover:bg-ivory lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
