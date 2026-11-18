import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/admin/components/AdminSidebar';
import AdminHeader from '@/admin/components/AdminHeader';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, getToken } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Auth guard */
  useEffect(() => {
    if (!isAuthenticated && !getToken()) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, getToken, navigate]);

  if (!isAuthenticated && !getToken()) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-ivory font-body text-espresso">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
