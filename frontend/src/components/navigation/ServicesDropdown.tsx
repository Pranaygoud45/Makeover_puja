import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { NavItem } from '@/types';

interface ServicesDropdownProps {
  items: NavItem[];
  isOpen: boolean;
}

export default function ServicesDropdown({ items, isOpen }: ServicesDropdownProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute left-1/2 top-full z-50 mt-2 w-[520px] -translate-x-1/2 rounded-sm border border-champagne bg-white p-6 shadow-xl"
        >
          <div className="grid grid-cols-3 gap-3">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="rounded-sm px-3 py-2 text-sm text-espresso transition-colors hover:bg-ivory hover:text-rose"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 border-t border-champagne pt-4">
            <Link
              to="/services"
              className="text-sm font-medium text-rose hover:text-rose-dark"
            >
              View All Services →
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
