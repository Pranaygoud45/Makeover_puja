import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/constants';
import { Button } from '@/components/ui/Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleExpand = (label: string) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={onClose}
          />

          {/* Slide-in panel */}
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-y-0 right-0 z-50 flex w-80 flex-col bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-champagne px-6 py-4">
              <div>
                <span className="font-display text-xl font-bold text-espresso">
                  POOJA
                </span>
                <span className="ml-1 font-display text-xl font-light text-espresso">
                  MAKEOVER
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-espresso transition-colors hover:bg-ivory"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => toggleExpand(item.label)}
                          className="flex w-full items-center justify-between py-3 text-base font-medium text-espresso transition-colors hover:text-rose"
                        >
                          {item.label}
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 transition-transform duration-200',
                              expandedItem === item.label && 'rotate-180'
                            )}
                          />
                        </button>
                        <AnimatePresence>
                          {expandedItem === item.label && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-4"
                            >
                              {item.children.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    to={child.href}
                                    onClick={onClose}
                                    className="block py-2 text-sm text-taupe transition-colors hover:text-rose"
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className="block py-3 text-base font-medium text-espresso transition-colors hover:text-rose"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="border-t border-champagne px-6 py-6">
              <Button
                variant="rose"
                size="lg"
                to="/book-appointment"
                className="w-full"
                onClick={onClose}
              >
                Book Appointment
              </Button>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
