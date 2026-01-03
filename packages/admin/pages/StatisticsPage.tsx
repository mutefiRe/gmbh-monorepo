import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Clock
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { SectionErrorBoundary } from '../components/SectionErrorBoundary';

const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    {subtext ? (
      <div className="mt-4 flex items-center text-sm">
        <span className="text-green-500 font-medium flex items-center gap-1">
          <TrendingUp size={14} />
          {subtext}
        </span>
      </div>
    ) : null}
  </div>
);

export const StatisticsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const eventId = api.getEventId() || 'active';
  const summaryQuery = useQuery({
    queryKey: ['stats', 'summary', eventId],
    queryFn: api.getStatsSummary,
    enabled: isAuthenticated
  });
  const salesHalfHourQuery = useQuery({
    queryKey: ['stats', 'sales-half-hour', eventId],
    queryFn: api.getStatsSalesHalfHour,
    enabled: isAuthenticated
  });
  const recentOrdersQuery = useQuery({
    queryKey: ['stats', 'recent-orders', eventId],
    queryFn: () => api.getStatsRecentOrders(5),
    enabled: isAuthenticated
  });
  const topItemsQuery = useQuery({
    queryKey: ['stats', 'top-items', eventId],
    queryFn: () => api.getStatsTopItems(15),
    enabled: isAuthenticated
  });

  const isLoading = summaryQuery.isLoading
    || salesHalfHourQuery.isLoading
    || recentOrdersQuery.isLoading
    || topItemsQuery.isLoading;
  const isError = summaryQuery.isError
    || salesHalfHourQuery.isError
    || recentOrdersQuery.isError
    || topItemsQuery.isError;
  const summary = summaryQuery.data;
  const salesHour = salesHalfHourQuery.data?.data;
  const recentOrders = recentOrdersQuery.data?.recentOrders ?? [];
  const topItems = topItemsQuery.data?.items ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Statistik (experimentell)</h1>
          <p className="text-slate-500">Lade Statistiken…</p>
        </div>
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Statistik (experimentell)</h1>
          <p className="text-rose-600">Statistiken konnten nicht geladen werden.</p>
        </div>
      </div>
    );
  }

  const salesBuckets = salesHour?.buckets ?? [];
  const data = salesBuckets.map((bucket) => ({
    name: new Intl.DateTimeFormat('de-DE', {
      timeZone: 'UTC',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(bucket.ts)),
    total: bucket.total,
    paid: bucket.paid
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Statistik (experimentell)</h1>
        <p className="text-slate-500">Die Statistik befindet sich im Aufbau und kann noch ungenau sein.</p>
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Hinweis: Diese Auswertungen sind experimentell und nicht für Abrechnungen gedacht.
      </div>

      <SectionErrorBoundary title="Statistik Übersicht">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Gesamtumsatz"
            value={`${summary.totalRevenue.toFixed(2)} €`}
            icon={ShoppingBag}
            color="bg-primary-1000"
          />
          <StatCard
            title="Bestellungen"
            value={summary.ordersCount}
            icon={Clock}
            color="bg-orange-500"
          />
          <StatCard
            title="Aktivierte Tische"
            value={summary.activeTables}
            icon={Users}
            color="bg-emerald-500"
          />
          <StatCard
            title="Durchschn. Bestellwert"
            value={`${summary.averageOrderValue.toFixed(2)} €`}
            icon={TrendingUp}
            color="bg-purple-500"
          />
        </div>
      </SectionErrorBoundary>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SectionErrorBoundary title="Umsatz pro halbe Stunde">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Umsatz pro halbe Stunde</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`${value.toFixed(2)} €`, 'Umsatz']}
                  />
                  <Bar dataKey="total" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="paid" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary title="Letzte Aktivitäten">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Letzte Aktivitäten</h3>
            <div className="space-y-6">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary flex items-center justify-center font-bold text-xs">
                    ORD
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Neue Bestellung #{order.number}</p>
                    <p className="text-xs text-slate-500">{order.tableName}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{order.total.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          </div>
        </SectionErrorBoundary>
      </div>

      <SectionErrorBoundary title="Meistverkaufte Artikel">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">Meistverkaufte Artikel</h3>
            <span className="text-xs text-slate-400">Top 15</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-slate-600">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="py-2 text-left font-semibold">Artikel</th>
                  <th className="py-2 text-right font-semibold">Menge</th>
                  <th className="py-2 text-right font-semibold">Umsatz</th>
                </tr>
              </thead>
              <tbody>
                {topItems.length === 0 ? (
                  <tr>
                    <td className="py-3 text-slate-400" colSpan={3}>Noch keine Verkäufe</td>
                  </tr>
                ) : (
                  topItems.map((item) => (
                    <tr key={item.name} className="border-t border-slate-100">
                      <td className="py-2 text-slate-700 font-medium">{item.name}</td>
                      <td className="py-2 text-right">{item.amount}</td>
                      <td className="py-2 text-right">{item.revenue.toFixed(2)} €</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </SectionErrorBoundary>
    </div>
  );
};
