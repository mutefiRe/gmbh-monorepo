import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Activity, CheckCircle2, AlertTriangle, Wifi, Printer, Users, RefreshCw } from 'lucide-react';
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

type ActiveUser = {
  id: string;
  username: string;
  role?: string;
  lastSeen: number;
};

type HealthResponse = {
  status: string;
  api?: { ok: boolean };
  printerApi?: { ok: boolean; error?: string };
  activeWindowMinutes?: number;
  activeUsers?: ActiveUser[];
};

const StatusCard = ({ title, value, status, icon: Icon, hint }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {hint ? <p className="text-xs text-slate-500 mt-2">{hint}</p> : null}
      </div>
      <div className={`p-3 rounded-lg ${status === 'ok' ? 'bg-emerald-500' : status === 'warn' ? 'bg-amber-500' : 'bg-rose-500'}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const formatLastSeen = (ts: number) => {
  const diffMs = Date.now() - ts;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin <= 0) return 'gerade eben';
  if (diffMin < 60) return `vor ${diffMin} Min`;
  const diffHours = Math.floor(diffMin / 60);
  return `vor ${diffHours} Std`;
};

const INTERVAL_STATUS_REFRESH = 10000;
const INTERVAL_PRINTERS_REFRESH = 15000;
const INTERVAL_PRINTER_QUEUE_REFRESH = 30000;
const INTERVAL_ORDERS_REFRESH = 20000;

export const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const statusQuery = useQuery({
    queryKey: ['status'],
    queryFn: api.getStatus,
    enabled: isAuthenticated,
    refetchInterval: INTERVAL_STATUS_REFRESH
  });
  const printersQuery = useQuery({
    queryKey: ['printers-status'],
    queryFn: api.getPrintersStatus,
    enabled: isAuthenticated,
    refetchInterval: INTERVAL_PRINTERS_REFRESH
  });
  const [showQueue, setShowQueue] = React.useState(false);
  const printersQueueQuery = useQuery({
    queryKey: ['printers-queue'],
    queryFn: api.getPrintersQueueStatus,
    enabled: isAuthenticated && showQueue,
    refetchInterval: showQueue ? INTERVAL_PRINTER_QUEUE_REFRESH : false
  });
  const heartbeatQuery = useQuery({
    queryKey: ['status-orders'],
    queryFn: () => api.getStatusOrders(15, 60),
    enabled: isAuthenticated,
    refetchInterval: INTERVAL_ORDERS_REFRESH
  });

  const health = statusQuery.data as HealthResponse | undefined;
  const activeUsers = health?.activeUsers ?? [];
  const activeWindow = health?.activeWindowMinutes ?? 5;
  const activeWaiters = activeUsers.filter((user) => user.role === 'waiter');
  const activeAdmins = activeUsers.filter((user) => user.role === 'admin');

  const printers = (printersQuery.data ?? []).filter((printer) => printer.enabled !== false);
  const queuePrinters = (printersQueueQuery.data ?? []).filter((printer) => printer.enabled !== false);
  const queueMap = new Map(queuePrinters.map((printer) => [printer.id, printer.queue]));
  const reachablePrinters = printers.filter((printer) => printer.reachable);
  const offlinePrinters = printers.filter((printer) => !printer.reachable);

  const apiStatus = statusQuery.isError || health?.api?.ok === false
    ? 'error'
    : health?.api?.ok === true
      ? 'ok'
      : 'warn';
  const printerApiStatus = health?.printerApi?.ok === false
    ? 'warn'
    : 'ok';

  const heartbeat = heartbeatQuery.data?.points ?? [];
  const heartbeatData = heartbeat.map((point) => ({
    ts: point.ts,
    label: new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(point.ts)),
    count: point.count
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Systemstatus</h1>
        <p className="text-slate-500">Übersicht über Verbindung, Bedienungen und Drucker.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="API"
          value={apiStatus === 'ok' ? 'Verbunden' : 'Nicht erreichbar'}
          status={apiStatus}
          icon={Wifi}
          hint={statusQuery.isError ? 'Letzter Check fehlgeschlagen.' : `Ping alle ${INTERVAL_STATUS_REFRESH / 1000} Sekunden.`}
        />
        <StatusCard
          title="Bedienungen aktiv"
          value={`${activeWaiters.length}`}
          status={activeWaiters.length > 0 ? 'ok' : 'warn'}
          icon={Users}
          hint={`Aktiv in den letzten ${activeWindow} Minuten.`}
        />
        <StatusCard
          title="Printer API"
          value={health?.printerApi?.ok === false ? 'Nicht erreichbar' : 'Verbunden'}
          status={printerApiStatus}
          icon={Activity}
          hint={health?.printerApi?.ok === false ? 'Printer API antwortet nicht.' : 'Erreichbar.'}
        />
        <StatusCard
          title="Drucker online"
          value={`${reachablePrinters.length}/${printers.length}`}
          status={offlinePrinters.length === 0 ? 'ok' : offlinePrinters.length < printers.length ? 'warn' : 'error'}
          icon={Printer}
          hint="Status basiert auf Printer API."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SectionErrorBoundary title="Aktive Bedienungen">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-700 font-semibold mb-4">
              <Activity size={18} />
              <span>Aktive Bedienungen</span>
            </div>
            {activeWaiters.length === 0 ? (
              <p className="text-sm text-slate-500">Keine aktiven Bedienungen.</p>
            ) : (
              <div className="space-y-3">
                {activeWaiters.map((user) => (
                  <div key={user.id} className="flex items-center justify-between text-sm">
                    <div className="text-slate-700 font-medium">{user.username}</div>
                    <div className="text-xs text-slate-500">{formatLastSeen(user.lastSeen)}</div>
                  </div>
                ))}
              </div>
            )}
            {activeAdmins.length > 0 ? (
              <div className="mt-4 text-xs text-slate-400">
                Admins aktiv: {activeAdmins.map((user) => user.username).join(', ')}
              </div>
            ) : null}
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary title="Druckerstatus">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-700 font-semibold mb-4">
              <Printer size={18} />
              <span>Druckerstatus</span>
            </div>
            <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
              <span>Kein Discovery-Scan – nur Statusabfrage.</span>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                onClick={() => setShowQueue((prev) => !prev)}
              >
                <RefreshCw size={14} />
                {showQueue ? 'Queue ausblenden' : 'Queue laden'}
              </button>
            </div>
            {printersQuery.isLoading ? (
              <p className="text-sm text-slate-500">Druckerstatus wird geladen…</p>
            ) : printers.length === 0 ? (
              <p className="text-sm text-slate-500">Keine Drucker eingerichtet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {printers.map((printer) => {
                  const isOnline = Boolean(printer.reachable);
                  const queue = queueMap.get(printer.id);
                  return (
                    <div
                      key={printer.id}
                      className={`px-3 py-2 rounded-lg border text-sm flex items-center justify-between ${isOnline ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}
                    >
                      <div>
                        <div className="font-medium text-slate-700">{printer.name}</div>
                        {showQueue ? (
                          <div className="text-xs text-slate-500">
                            Queue: {queue?.queued ?? '-'}
                          </div>
                        ) : null}
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${isOnline ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isOnline ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                        {isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </SectionErrorBoundary>
      </div>

      <SectionErrorBoundary title="Letzte Bestellungen">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <Activity size={18} />
              <span>Letzte Bestellungen (15 Minuten)</span>
            </div>
            <span className="text-xs text-slate-400">Update alle {INTERVAL_ORDERS_REFRESH / 1000}s</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={heartbeatData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value}`, 'Bestellungen']}
                />
                <Bar dataKey="count" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </SectionErrorBoundary>
    </div>
  );
};
