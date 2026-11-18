import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';

import Home from '@/pages/public/Home';
import About from '@/pages/public/About';
import Services from '@/pages/public/Services';
import ServiceDetails from '@/pages/public/ServiceDetails';
import BridalMakeup from '@/pages/public/BridalMakeup';
import Gallery from '@/pages/public/Gallery';
import Packages from '@/pages/public/Packages';
import Testimonials from '@/pages/public/Testimonials';
import Blog from '@/pages/public/Blog';
import BlogPost from '@/pages/public/Blog/BlogPost';
import Offers from '@/pages/public/Offers';
import Contact from '@/pages/public/Contact';
import Booking from '@/pages/public/Booking';
import PrivacyPolicy from '@/pages/public/PrivacyPolicy';
import Terms from '@/pages/public/Terms';
import NotFound from '@/pages/public/NotFound';

const AdminLogin = lazy(() => import('@/admin/pages/Login'));
const AdminDashboard = lazy(() => import('@/admin/pages/Dashboard'));
const AdminAppointments = lazy(() => import('@/admin/pages/Appointments'));
const AdminServices = lazy(() => import('@/admin/pages/Services'));
const AdminPackages = lazy(() => import('@/admin/pages/Packages'));
const AdminGallery = lazy(() => import('@/admin/pages/Gallery'));
const AdminTestimonials = lazy(() => import('@/admin/pages/Testimonials'));
const AdminBlog = lazy(() => import('@/admin/pages/Blog'));
const AdminCustomers = lazy(() => import('@/admin/pages/Customers'));
const AdminOffers = lazy(() => import('@/admin/pages/Offers'));
const AdminStaff = lazy(() => import('@/admin/pages/Staff'));
const AdminReports = lazy(() => import('@/admin/pages/Reports'));
const AdminSettings = lazy(() => import('@/admin/pages/Settings'));

function withSuspense(Component: ComponentType) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-ivory font-body text-sm text-taupe">
          Loading…
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'services', element: <Services /> },
      { path: 'services/:slug', element: <ServiceDetails /> },
      { path: 'bridal-makeup', element: <BridalMakeup /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'packages', element: <Packages /> },
      { path: 'testimonials', element: <Testimonials /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPost /> },
      { path: 'offers', element: <Offers /> },
      { path: 'contact', element: <Contact /> },
      { path: 'book-appointment', element: <Booking /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'terms', element: <Terms /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/admin/login',
    element: withSuspense(AdminLogin),
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: withSuspense(AdminDashboard) },
      { path: 'appointments', element: withSuspense(AdminAppointments) },
      { path: 'services', element: withSuspense(AdminServices) },
      { path: 'packages', element: withSuspense(AdminPackages) },
      { path: 'gallery', element: withSuspense(AdminGallery) },
      { path: 'reviews', element: withSuspense(AdminTestimonials) },
      { path: 'blog', element: withSuspense(AdminBlog) },
      { path: 'customers', element: withSuspense(AdminCustomers) },
      { path: 'offers', element: withSuspense(AdminOffers) },
      { path: 'staff', element: withSuspense(AdminStaff) },
      { path: 'reports', element: withSuspense(AdminReports) },
      { path: 'settings', element: withSuspense(AdminSettings) },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
