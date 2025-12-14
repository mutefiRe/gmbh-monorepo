import React, { useContext } from 'react';
import { AppContext } from '../App';
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
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

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
    <div className="mt-4 flex items-center text-sm">
      <span className="text-green-500 font-medium flex items-center gap-1">
        <TrendingUp size={14} />
        {subtext}
      </span>
      <span className="text-slate-400 ml-2">vs. letzte Woche</span>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return null;
  const { orders, tables } = context;

  const totalRevenue = orders.reduce((acc, order) => {
    const orderitems = order.orderitems || [];
    const orderTotal = orderitems.reduce((sum, oi) => sum + oi.price * oi.count, 0);
    return acc + orderTotal;
  }, 0);
  const activeTables = tables.filter(t => t.enabled).length; // Simplified logic
  const data = Array.from({ length: 7 }).map((_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));
    const dayString = day.toLocaleDateString('de-DE', { weekday: 'short' });
    const sales = orders
      .filter(order => {

        const orderDate = new Date(order.createdAt);
        return orderDate.getDate() === day.getDate() &&
          orderDate.getMonth() === day.getMonth() &&
          orderDate.getFullYear() === day.getFullYear();
      })
      .reduce((sum, order) => {
        const orderitems = order.orderitems || [];
        const orderTotal = orderitems.reduce((oiSum, oi) => oiSum + oi.price * oi.count, 0);
        return sum + orderTotal;
      }, 0);

    return { name: dayString, sales };
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Willkommen zurück, hier ist eine Übersicht für heute.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Gesamtumsatz"
          value={`${totalRevenue.toFixed(2)} €`}
          subtext="+12.5%"
          icon={ShoppingBag}
          color="bg-primary-1000"
        />
        <StatCard
          title="Bestellungen"
          value={orders.length}
          subtext="+4.3%"
          icon={Clock}
          color="bg-orange-500"
        />
        <StatCard
          title="Aktivierte Tische"
          value={activeTables}
          subtext="+2"
          icon={Users}
          color="bg-emerald-500"
        />
        <StatCard
          title="Durchschn. Bestellwert"
          value={`${(totalRevenue / (orders.length || 1)).toFixed(2)} €`}
          subtext="+1.2%"
          icon={TrendingUp}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Umsatzübersicht</h3>
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
                <Bar dataKey="sales" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Letzte Aktivitäten</h3>
          <div className="space-y-6">
            {orders.slice(0, 5).map((order) => {
              const orderitems = order.orderitems || [];
              const orderTotal = orderitems.reduce((sum, oi) => sum + oi.price * oi.count, 0);
              return (
                <div key={order.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary flex items-center justify-center font-bold text-xs">
                    ORD
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Neue Bestellung #{order.number}</p>
                    <p className="text-xs text-slate-500">Tisch {order.table}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{orderTotal.toFixed(2)} €</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};