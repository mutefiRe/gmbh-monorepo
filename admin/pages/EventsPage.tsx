import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/components/NotificationProvider";
import { api } from "@/services/api";
import { Dialog } from "@/components/Dialog";

export function EventsPage() {
  const [newEventName, setNewEventName] = useState("");
  const [newEventStart, setNewEventStart] = useState("");
  const [newEventEnd, setNewEventEnd] = useState("");
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);
  const [pendingDeleteEventId, setPendingDeleteEventId] = useState<string | null>(null);
  const [importEventId, setImportEventId] = useState<string>("");
  const [importOptions, setImportOptions] = useState({
    units: true,
    categories: false,
    items: false,
    areas: false,
    tables: false
  });
  const { notify } = useNotification();
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["events"], queryFn: api.getEvents });
  const events = data?.events ?? [];
  const activeEventId = data?.activeEventId ?? null;

  const createEventMutation = useMutation({
    mutationFn: api.createEvent,
    onSuccess: (event) => {
      notify(`Event erstellt: ${event.name}`, "success");
      setNewEventName("");
      setNewEventStart("");
      setNewEventEnd("");
      api.setEventId(event.id);
      queryClient.invalidateQueries();
    },
    onError: () => notify("Event konnte nicht erstellt werden", "error")
  });

  const setActiveMutation = useMutation({
    mutationFn: api.setActiveEvent,
    onSuccess: () => {
      notify("Event aktiviert", "success");
      queryClient.invalidateQueries();
    },
    onError: () => notify("Event konnte nicht aktiviert werden", "error")
  });

  const deleteEventMutation = useMutation({
    mutationFn: api.deleteEvent,
    onSuccess: () => {
      notify("Event gelöscht", "success");
      queryClient.invalidateQueries();
    },
    onError: () => notify("Event konnte nicht gelöscht werden", "error")
  });

  const handleCreate = () => {
    if (!newEventName.trim()) {
      notify("Bitte einen Eventnamen eingeben", "error");
      return;
    }
    const include = importEventId
      ? {
        units: importOptions.units,
        categories: importOptions.categories || importOptions.items,
        items: importOptions.items,
        areas: importOptions.areas || importOptions.tables,
        tables: importOptions.tables
      }
      : undefined;
    createEventMutation.mutate({
      name: newEventName.trim(),
      beginDate: newEventStart || undefined,
      endDate: newEventEnd || undefined,
      importFromEventId: importEventId || undefined,
      include
    });
  };

  const pendingDeleteEvent = events.find((event) => event.id === pendingDeleteEventId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Events</h1>
      <p className="text-slate-500 mb-6">Events verwalten, aktivieren oder mit Daten duplizieren.</p>

      <div className="rounded-xl border border-slate-200 bg-white p-5 mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Aktive Events</h2>
        {events.length === 0 ? (
          <p className="text-sm text-slate-500">Noch keine Events vorhanden.</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => {
              const isActive = event.id === activeEventId;
              return (
                <div key={event.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-800">{event.name}</span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {isActive ? "Aktiv" : "Inaktiv"}
                      </span>
                    </div>
                    {(event.beginDate || event.endDate) && (
                      <p className="text-xs text-slate-500 mt-1">
                        {event.beginDate ? `Start: ${event.beginDate}` : "Kein Startdatum"}
                        {event.endDate ? ` · Ende: ${event.endDate}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <button
                      onClick={() => setPendingEventId(event.id)}
                      disabled={isActive || setActiveMutation.isPending}
                      className={`h-9 rounded-lg px-4 text-sm font-semibold transition ${isActive
                        ? "cursor-default bg-slate-100 text-slate-400"
                        : "bg-primary-500 text-white hover:bg-primary-600"
                        }`}
                    >
                      {isActive ? "Aktiv" : "Aktiv setzen"}
                    </button>
                    <button
                      onClick={() => setPendingDeleteEventId(event.id)}
                      disabled={isActive || deleteEventMutation.isPending}
                      className={`h-9 rounded-lg px-4 text-sm font-semibold transition ${isActive
                        ? "cursor-default bg-slate-100 text-slate-400"
                        : "border border-red-200 text-red-600 hover:bg-red-50"
                        }`}
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Neues Event anlegen</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col text-sm text-slate-600">
            Name
            <input
              type="text"
              value={newEventName}
              onChange={(event) => setNewEventName(event.target.value)}
              className="mt-1 h-10 rounded-lg border border-slate-200 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              placeholder="Sommerfest 2025"
            />
          </label>
          <label className="flex flex-col text-sm text-slate-600">
            Start
            <input
              type="date"
              value={newEventStart}
              onChange={(event) => setNewEventStart(event.target.value)}
              className="mt-1 h-10 rounded-lg border border-slate-200 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
          </label>
          <label className="flex flex-col text-sm text-slate-600">
            Ende
            <input
              type="date"
              value={newEventEnd}
              onChange={(event) => setNewEventEnd(event.target.value)}
              className="mt-1 h-10 rounded-lg border border-slate-200 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
          </label>
        </div>
        <div className="mt-6 space-y-4">
          <div className="text-sm font-semibold text-slate-700">Daten aus bestehendem Event importieren</div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-sm text-slate-600">
              Quelle
              <select
                value={importEventId}
                onChange={(event) => setImportEventId(event.target.value)}
                className="mt-1 h-10 rounded-lg border border-slate-200 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              >
                <option value="">Kein Import</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}{event.id === activeEventId ? " (aktiv)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <div className="text-xs text-slate-500 leading-relaxed">
              Bestellungen, Drucker und Benutzer werden nie importiert.
              Artikel benötigen Kategorien und Einheiten. Tische benötigen Bereiche.
            </div>
          </div>
          <div className={`grid gap-3 sm:grid-cols-2 ${importEventId ? "" : "opacity-50 pointer-events-none"}`}>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={importOptions.units}
                onChange={(event) => setImportOptions((prev) => ({
                  ...prev,
                  units: event.target.checked
                }))}
              />
              Einheiten
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={importOptions.categories || importOptions.items}
                disabled={importOptions.items}
                onChange={(event) => setImportOptions((prev) => ({
                  ...prev,
                  categories: event.target.checked
                }))}
              />
              Kategorien
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={importOptions.items}
                onChange={(event) => setImportOptions((prev) => ({
                  ...prev,
                  items: event.target.checked,
                  units: event.target.checked ? true : prev.units,
                  categories: event.target.checked ? true : prev.categories
                }))}
              />
              Artikel
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={importOptions.areas || importOptions.tables}
                disabled={importOptions.tables}
                onChange={(event) => setImportOptions((prev) => ({
                  ...prev,
                  areas: event.target.checked
                }))}
              />
              Bereiche
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={importOptions.tables}
                onChange={(event) => setImportOptions((prev) => ({
                  ...prev,
                  tables: event.target.checked,
                  areas: event.target.checked ? true : prev.areas
                }))}
              />
              Tische
            </label>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCreate}
            disabled={!newEventName.trim() || createEventMutation.isPending}
            className="h-10 rounded-lg bg-primary-500 px-5 text-sm font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            Event erstellen
          </button>
        </div>
      </div>

      <Dialog
        open={!!pendingEventId}
        onClose={() => setPendingEventId(null)}
        title={<h3 className="text-lg font-bold text-slate-800">Event aktivieren?</h3>}
        actions={(
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPendingEventId(null)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={() => {
                if (!pendingEventId) return;
                setActiveMutation.mutate(pendingEventId);
                setPendingEventId(null);
              }}
              className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
            >
              Aktiv setzen
            </button>
          </div>
        )}
      >
        <div className="p-6 space-y-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-800">
            Das Aktivieren eines neuen Events setzt alle anderen Events auf Read‑Only.
          </p>
          <p>
            Bitte nur aktivieren, wenn aktuell kein Betrieb läuft, damit keine laufenden Bestellungen betroffen sind.
          </p>
        </div>
      </Dialog>

      <Dialog
        open={!!pendingDeleteEventId}
        onClose={() => setPendingDeleteEventId(null)}
        title={<h3 className="text-lg font-bold text-slate-800">Event löschen?</h3>}
        actions={(
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPendingDeleteEventId(null)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={() => {
                if (!pendingDeleteEventId) return;
                deleteEventMutation.mutate(pendingDeleteEventId);
                setPendingDeleteEventId(null);
              }}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Löschen
            </button>
          </div>
        )}
      >
        <div className="p-6 space-y-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-800">
            Dieses Event wird vollständig gelöscht.
          </p>
          <p>
            Entfernt werden alle Bestellungen, Artikel, Kategorien, Einheiten, Bereiche und Tische.
            Benutzer und Drucker bleiben erhalten.
          </p>
          {pendingDeleteEvent && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              Zu löschendes Event: <span className="font-semibold">{pendingDeleteEvent.name}</span>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
