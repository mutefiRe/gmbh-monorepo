import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useNotification } from '@/components/NotificationProvider';
import { UpdateRestartInfo, UpdateServiceStatus } from '@/types';

export function UpdatePage() {
  const { notify } = useNotification();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['update-status'],
    queryFn: api.getUpdateStatus,
    refetchInterval: 60_000,
    retry: false
  });
  const [restartLog, setRestartLog] = useState<Record<string, UpdateRestartInfo[]>>({});

  const pullMutation = useMutation({
    mutationFn: ({ serviceId }: { serviceId: string }) => api.pullUpdate(serviceId),
    onSuccess: (result) => {
      notify(`${result.service} zieht ${result.tag} nach`, 'success');
      setRestartLog((prev) => ({
        ...prev,
        [result.service]: result.restart ?? []
      }));
      refetch();
    },
    onError: (err: unknown) => {
      notify(`Pull fehlgeschlagen: ${(err as Error).message}`, 'error');
    }
  });

  const services = data?.services ?? [];

  const renderService = (service: UpdateServiceStatus) => {
    const restartEntries = restartLog[service.id] ?? [];
    return (
      <div key={service.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {service.status === 'running' ? 'Läuft' : 'Nicht gestartet'}
            </div>
            <div className="text-lg font-bold text-slate-800">{service.label}</div>
          </div>
          <div
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              service.status === 'running' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {service.status}
          </div>
        </div>
        <div className="text-sm text-slate-600 space-y-1">
          <p>
            Aktuelles Image: <span className="font-semibold">{service.image}</span>
          </p>
          <p>
            Aktuelle Version: <span className="font-semibold">{service.currentVersion || 'unbekannt'}</span>
          </p>
          <p>
            Verfügbare Version: <span className="font-semibold">{service.availableVersion || 'keine Info'}</span>
          </p>
          {service.containerId && (
            <p className="text-xs text-slate-400 mt-1">Container: {service.containerId.slice(0, 12)}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => pullMutation.mutate({ serviceId: service.id })}
            disabled={pullMutation.isLoading}
            className="inline-flex items-center gap-2 rounded-full border border-primary-300 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Pull latest
          </button>
          <span className="text-xs text-slate-400">
            Zuletzt aktualisiert: {data?.registry}/{data?.repo}
          </span>
        </div>
        {restartEntries.length > 0 && (
          <div className="text-xs text-slate-500 space-y-1">
            {restartEntries.map((entry) => (
              <p key={entry.containerId} className="break-words">
                Container {entry.containerId.slice(0, 12)}:&nbsp;
                {entry.status === 'restarted' ? 'neu gestartet' : `Fehler: ${entry.error}`}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  const errorMessage = (error as Error)?.message || 'Update API nicht erreichbar';

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Updates</h1>
        <p className="text-sm text-slate-600">
          Hier siehst du, welche Docker-Images gerade laufen und welche Versionen verfügbar sind.
          Die API wird nur unter <code className="bg-slate-100 px-2 py-0.5 rounded">UPDATE_API_URL</code> aktiviert.
        </p>
      </div>
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Lädt...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {services.length ? services.map(renderService) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white/50 p-6 text-sm text-slate-500">
              Keine Dienste gefunden.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
