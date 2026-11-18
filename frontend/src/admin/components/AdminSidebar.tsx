import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Scissors,
  PackageOpen,
  Image,
  Star,
  FileText,
  Users,
  BadgePercent,
  UserCog,
  BarChart3,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Appointments', href: '/admin/appointments', icon: CalendarCheck },
  { label: 'Services', href: '/admin/services', icon: Scissors },
  { label: 'Packages', href: '/admin/packages', icon: PackageOpen },
  { label: 'Gallery', href: '/admin/gallery', icon: Image },
  { label: 'Testimonials', href: '/admin/reviews', icon: Star },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Offers', href: '/admin/offers', icon: BadgePercent },
  { label: 'Staff', href: '/admin/staff', icon: UserCog },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/admin/login', { replace: true });
  };

  const sidebarContent = (
    <div className="flex h-full w-64 flex-col bg-espresso text-white">
      {/* Brand header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <Link to="/admin" onClick={onClose} className="block">
          <span className="font-display text-lg font-bold tracking-wide text-white">
            POOJA
          </span>
          <span className="ml-1.5 font-display text-lg font-light text-taupe-light">
            ADMIN
          </span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-1 text-taupe-light hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        <ul className="space-y-1">
          {ADMIN_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  to={href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-rose font-medium text-white shadow-xs'
                      : 'text-taupe-light hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout & footer */}
      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-taupe-light transition-colors hover:bg-red-500/20 hover:text-red-200"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>
        <p className="mt-2 px-3 text-xs text-taupe/80">
          &copy; {new Date().getFullYear()} Pooja Makeover
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen shrink-0 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile slide-over sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />
          <aside className="relative z-10 h-full">{sidebarContent}</aside>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;

