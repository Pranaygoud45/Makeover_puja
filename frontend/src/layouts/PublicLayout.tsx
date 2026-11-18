import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/navigation/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';

export default function PublicLayout() {
  const { pathname } = useLocation();

  /* Scroll to top on route change */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-[72px]">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
