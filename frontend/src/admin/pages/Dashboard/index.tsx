import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Clock,
  Scissors,
  Image,
  PackageOpen,
  BadgePercent,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { adminApiRequest, extractItems, formatDate } from '@/admin/lib/api';
import type { AdminAppointment, DashboardSummary } from '@/admin/types';
import StatsCard from '@/admin/components/StatsCard';
import StatusBadge from '@/admin/components/StatusBadge';
import DataTable, { type Column } from '@/admin/components/DataTable';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const {
    data: dashboardData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      let summary: DashboardSummary | null = null;
      try {
        summary = await adminApiRequest<DashboardSummary>('/dashboard/stats');
      } catch {
        summary = null;
      }

      const appointmentsRes = await adminApiRequest<
        AdminAppointment[] | { items: AdminAppointment[]; total?: number }
      >('/appointments?page_size=50');
      const appointments = extractItems(appointmentsRes);

      const todayStr = new Date().toISOString().slice(0, 10);
      const todayCount =
        summary?.appointments?.today ??
        appointments.filter((a) => a.preferred_date === todayStr).length;
      const totalCount =
        summary?.appointments?.total ??
        (!Array.isArray(appointmentsRes) && typeof appointmentsRes.total === 'number'
          ? appointmentsRes.total
          : appointments.length);
      const pendingCount =
        summary?.appointments?.by_status?.pending ??
        appointments.filter((a) => a.status === 'pending').length;
      const confirmedCount =
        summary?.appointments?.by_status?.confirmed ??
        appointments.filter((a) => a.status === 'confirmed').length;

      const recent = appointments.slice(0, 5);

      return {
        todayCount,
        totalCount,
        pendingCount,
        confirmedCount,
        recent,
      };
    },
  });

  const columns: Column<AdminAppointment>[] = [
    {
      key: 'customer_name',
      header: 'Customer',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-espresso">{row.customer_name}</p>
          <p className="text-xs text-espresso/60">{row.mobile}</p>
        </div>
      ),
    },
    {
      key: 'service',
      header: 'Service',
      sortable: true,
      render: (row) => <span className="text-sm">{row.service}</span>,
    },
    {
      key: 'preferred_date',
      header: 'Date & Time',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm">{formatDate(row.preferred_date)}</p>
          <p className="text-xs text-espresso/60">{row.preferred_time}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const quickActions = [
    {
      label: 'Manage Services',
      description: 'Update categories, prices & durations',
      href: '/admin/services',
      icon: Scissors,
    },
    {
      label: 'View Gallery',
      description: 'Add portfolio & before-after looks',
      href: '/admin/gallery',
      icon: Image,
    },
    {
      label: 'Bridal Packages',
      description: 'Edit packages & included features',
      href: '/admin/packages',
      icon: PackageOpen,
    },
    {
      label: 'Special Offers',
      description: 'Create seasonal deals & promo codes',
      href: '/admin/offers',
      icon: BadgePercent,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-xl border border-champagne/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-rose">
              Pooja Makeover Salon
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-espresso">
              Welcome back, {user?.full_name || 'Admin'}
            </h2>
            <p className="mt-1 text-sm text-espresso/70">
              Here is an overview of today&apos;s salon schedule and recent bookings.
            </p>
          </div>
          <Link
            to="/admin/appointments"
            className="inline-flex items-center gap-2 self-start rounded-sm bg-rose px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-dark sm:self-auto"
          >
            <CalendarCheck className="h-4 w-4" />
            Manage Appointments
          </Link>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>Failed to load dashboard metrics. Please check your connection.</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-sm border border-red-300 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Today's Appointments"
          value={isLoading ? '...' : (dashboardData?.todayCount ?? 0)}
          icon={<CalendarClock className="h-5 w-5" />}
          subtitle="Scheduled for today"
          accent="rose"
        />
        <StatsCard
          title="Total Appointments"
          value={isLoading ? '...' : (dashboardData?.totalCount ?? 0)}
          icon={<CalendarCheck className="h-5 w-5" />}
          subtitle="All-time bookings"
          accent="espresso"
        />
        <StatsCard
          title="Pending"
          value={isLoading ? '...' : (dashboardData?.pendingCount ?? 0)}
          icon={<Clock className="h-5 w-5" />}
          subtitle="Awaiting confirmation"
          accent="amber"
        />
        <StatsCard
          title="Confirmed"
          value={isLoading ? '...' : (dashboardData?.confirmedCount ?? 0)}
          icon={<CheckCircle2 className="h-5 w-5" />}
          subtitle="Ready for visit"
          accent="emerald"
        />
      </div>

      {/* Main Grid: Recent Appointments + Quick Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-espresso">
              Recent Appointments
            </h3>
            <Link
              to="/admin/appointments"
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-dark hover:underline"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <DataTable
            columns={columns}
            data={dashboardData?.recent ?? []}
            keyExtractor={(row) => row.id}
            isLoading={isLoading}
            emptyMessage="No appointments have been booked yet."
            pageSize={5}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-display text-lg font-semibold text-espresso">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {quickActions.map(({ label, description, href, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className="group flex items-center justify-between rounded-lg border border-champagne/70 bg-white p-4 shadow-xs transition-all hover:border-rose/60 hover:shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ivory text-rose-dark transition-colors group-hover:bg-rose group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-espresso">{label}</p>
                    <p className="text-xs text-espresso/60">{description}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-taupe transition-transform group-hover:translate-x-1 group-hover:text-rose-dark" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

