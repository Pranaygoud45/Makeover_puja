import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  TrendingUp,
  Users,
  AlertCircle,
} from 'lucide-react';
import { adminApiRequest, extractItems } from '@/admin/lib/api';
import type {
  AdminAppointment,
  DashboardReportsResponse,
  ReportsSummary,
} from '@/admin/types';
import StatsCard from '@/admin/components/StatsCard';

export default function AdminReportsPage() {
  const { data: report, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async (): Promise<ReportsSummary> => {
      try {
        const res =
          await adminApiRequest<DashboardReportsResponse>('/dashboard/reports');
        if (res?.summary && typeof res.summary.total_appointments === 'number') {
          return {
            total_appointments: res.summary.total_appointments,
            by_status: res.appointments_by_status ?? {},
            popular_services: (res.top_services ?? []).map((item) => ({
              service: item.service,
              count: item.bookings,
            })),
            completion_rate: res.summary.completion_rate_percent,
            total_customers: res.summary.unique_customers,
          };
        }
      } catch {
        /* fallback to computing from appointments */
      }

      const apptsRes = await adminApiRequest<
        AdminAppointment[] | { items: AdminAppointment[] }
      >('/appointments?page_size=100');
      const appointments = extractItems(apptsRes);

      const byStatus: Record<string, number> = {
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
      };
      const serviceCounts = new Map<string, number>();
      const monthCounts = new Map<string, number>();
      const uniqueMobiles = new Set<string>();

      for (const apt of appointments) {
        byStatus[apt.status] = (byStatus[apt.status] ?? 0) + 1;
        serviceCounts.set(
          apt.service,
          (serviceCounts.get(apt.service) ?? 0) + 1
        );
        const monthKey = (apt.preferred_date || apt.created_at || '').slice(0, 7);
        if (monthKey) {
          monthCounts.set(monthKey, (monthCounts.get(monthKey) ?? 0) + 1);
        }
        if (apt.mobile) uniqueMobiles.add(apt.mobile);
      }

      const popularServices = Array.from(serviceCounts.entries())
        .map(([service, count]) => ({ service, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      const monthlyAppointments = Array.from(monthCounts.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([month, count]) => ({ month, count }));

      const total = appointments.length;
      const completed = byStatus.completed ?? 0;

      return {
        total_appointments: total,
        by_status: byStatus,
        popular_services: popularServices,
        monthly_appointments: monthlyAppointments,
        completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
        total_customers: uniqueMobiles.size,
      };
    },
  });

  const total = report?.total_appointments ?? 0;
  const statusEntries = Object.entries(report?.by_status ?? {});
  const maxServiceCount = Math.max(
    1,
    ...(report?.popular_services ?? []).map((s) => s.count)
  );
  const maxMonthlyCount = Math.max(
    1,
    ...(report?.monthly_appointments ?? []).map((m) => m.count)
  );

  const STATUS_BAR_COLORS: Record<string, string> = {
    pending: 'bg-amber-400',
    confirmed: 'bg-emerald-500',
    completed: 'bg-sky-500',
    cancelled: 'bg-red-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-espresso">
          Reports &amp; Analytics
        </h2>
        <p className="text-sm text-espresso/60">
          Appointment trends, service popularity, and conversion metrics.
        </p>
      </div>

      {isError && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Failed to load analytics report.</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-sm border border-red-300 bg-white px-3 py-1 text-xs font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Bookings"
          value={isLoading ? '...' : total}
          icon={<CalendarCheck className="h-5 w-5" />}
          accent="espresso"
        />
        <StatsCard
          title="Confirmed"
          value={isLoading ? '...' : (report?.by_status?.confirmed ?? 0)}
          icon={<CheckCircle2 className="h-5 w-5" />}
          accent="emerald"
        />
        <StatsCard
          title="Completion Rate"
          value={
            isLoading
              ? '...'
              : `${report?.completion_rate ?? (total > 0 ? Math.round(((report?.by_status?.completed ?? 0) / total) * 100) : 0)}%`
          }
          icon={<TrendingUp className="h-5 w-5" />}
          accent="sky"
        />
        <StatsCard
          title="Unique Clients"
          value={isLoading ? '...' : (report?.total_customers ?? '—')}
          icon={<Users className="h-5 w-5" />}
          accent="rose"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status Distribution */}
        <div className="rounded-lg border border-champagne/70 bg-white p-6 shadow-xs">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-rose" />
            <h3 className="font-display text-lg font-semibold text-espresso">
              Appointments by Status
            </h3>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-8 animate-pulse rounded-sm bg-ivory" />
              ))}
            </div>
          ) : statusEntries.length === 0 ? (
            <p className="text-sm text-espresso/60">No booking data yet.</p>
          ) : (
            <div className="space-y-4">
              {statusEntries.map(([status, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={status} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="capitalize text-espresso">{status}</span>
                      <span className="text-espresso/70">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-ivory">
                      <div
                        className={`h-full rounded-full ${
                          STATUS_BAR_COLORS[status] ?? 'bg-rose'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Popular Services */}
        <div className="rounded-lg border border-champagne/70 bg-white p-6 shadow-xs">
          <h3 className="mb-5 font-display text-lg font-semibold text-espresso">
            Most Requested Services
          </h3>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-8 animate-pulse rounded-sm bg-ivory" />
              ))}
            </div>
          ) : (report?.popular_services ?? []).length === 0 ? (
            <p className="text-sm text-espresso/60">
              No service request data available yet.
            </p>
          ) : (
            <div className="space-y-4">
              {(report?.popular_services ?? []).map((item) => {
                const pct = Math.round((item.count / maxServiceCount) * 100);
                return (
                  <div key={item.service} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="truncate text-espresso">
                        {item.service}
                      </span>
                      <span className="text-espresso/70">
                        {item.count} booking{item.count === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-ivory">
                      <div
                        className="h-full rounded-full bg-rose"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Monthly Volume */}
      {(report?.monthly_appointments ?? []).length > 0 && (
        <div className="rounded-lg border border-champagne/70 bg-white p-6 shadow-xs">
          <h3 className="mb-5 font-display text-lg font-semibold text-espresso">
            Monthly Booking Volume
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {(report?.monthly_appointments ?? []).map((m) => {
              const heightPct = Math.max(
                15,
                Math.round((m.count / maxMonthlyCount) * 100)
              );
              return (
                <div
                  key={m.month}
                  className="flex flex-col items-center rounded-lg border border-champagne/50 bg-ivory/50 p-3"
                >
                  <div className="flex h-24 w-full items-end justify-center">
                    <div
                      className="w-8 rounded-t-sm bg-espresso transition-all"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-bold text-espresso">
                    {m.count}
                  </p>
                  <p className="text-xs text-espresso/60">{m.month}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

