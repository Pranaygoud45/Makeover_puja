import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, LogOut, CalendarClock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ADMIN_NAV_ITEMS } from './AdminSidebar';
import { adminApiRequest, extractItems } from '@/admin/lib/api';
import type { AdminAppointment } from '@/admin/types';

export interface AdminHeaderProps {
  title?: string;
  onMenuClick: () => void;
}

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [pendingItems, setPendingItems] = useState<AdminAppointment[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const matchedNav = ADMIN_NAV_ITEMS.find((item) =>
    item.href === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(item.href)
  );
  const pageTitle = title ?? matchedNav?.label ?? 'Admin Portal';

  useEffect(() => {
    let active = true;
    adminApiRequest<AdminAppointment[] | { items: AdminAppointment[] }>(
      '/appointments?status=pending&page_size=5'
    )
      .then((res) => {
        if (active) {
          setPendingItems(extractItems(res).slice(0, 5));
        }
      })
      .catch(() => {
        /* ignore notification fetch errors silently */
      });
    return () => {
      active = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.full_name || 'Admin';
  const displayEmail = user?.email || 'admin@poojamakeover.com';
  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-champagne/70 bg-white/95 backdrop-blur-xs">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-sm p-2 text-espresso transition-colors hover:bg-ivory lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-xl font-semibold text-espresso sm:text-2xl">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((prev) => !prev)}
              className="relative rounded-full p-2 text-espresso/70 transition-colors hover:bg-ivory hover:text-espresso"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {pendingItems.length > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-rose" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg border border-champagne bg-white p-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-champagne/60 pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-espresso">
                    Pending Requests
                  </span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    {pendingItems.length}
                  </span>
                </div>
                {pendingItems.length === 0 ? (
                  <p className="py-4 text-center text-xs text-espresso/60">
                    No pending appointments
                  </p>
                ) : (
                  <ul className="divide-y divide-champagne/40 py-1">
                    {pendingItems.map((apt) => (
                      <li key={apt.id} className="py-2">
                        <Link
                          to="/admin/appointments"
                          onClick={() => setNotifOpen(false)}
                          className="flex items-start gap-2.5 rounded-sm p-1 transition-colors hover:bg-ivory"
                        >
                          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-rose" />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-espresso">
                              {apt.customer_name}
                            </p>
                            <p className="truncate text-xs text-espresso/60">
                              {apt.service} &middot; {apt.preferred_date}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  to="/admin/appointments"
                  onClick={() => setNotifOpen(false)}
                  className="mt-1 block rounded-sm bg-ivory py-1.5 text-center text-xs font-medium text-rose-dark hover:bg-champagne/50"
                >
                  View all appointments
                </Link>
              </div>
            )}
          </div>

          {/* Admin user info */}
          <div className="flex items-center gap-2.5 border-l border-champagne/70 pl-3 sm:pl-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-espresso text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-none text-espresso">
                {displayName}
              </p>
              <p className="mt-0.5 text-xs text-espresso/60">{displayEmail}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden items-center gap-1.5 rounded-sm border border-champagne px-2.5 py-1.5 text-xs font-medium text-espresso transition-colors hover:bg-ivory sm:inline-flex"
            title="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;

