import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/components/NotificationProvider";
import { api } from "@/services/api";
import { Dialog } from "@/components/Dialog";
import { LoadingNotice } from "@/components/LoadingNotice";

export function EventsPage() {
  const [newEventName, setNewEventName] = useState("");
  const [newEventStart, setNewEventStart] = useState("");
  const [newEventEnd, setNewEventEnd] = useState("");
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);
  const [pendingDeleteEventId, setPendingDeleteEventId] = useState<string | null>(null);
  const [importEventId, setImportEventId] = useState<string>("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventEdits, setEventEdits] = useState<Record<string, {
    name: string;
    beginDate: string;
    endDate: string;
    customTables: boolean;
  }>>({});
  const [importOptions, setImportOptions] = useState({
    units: true,
    categories: false,
    items: false,
    areas: false,
    tables: false
  });
  const { notify } = useNotification();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["events"], queryFn: api.getEvents });
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

  const updateEventMutation = useMutation({
    mutationFn: ({ eventId, payload }: { eventId: string; payload: { name?: string; beginDate?: string | null; endDate?: string | null; customTables?: boolean } }) =>
      api.updateEvent(eventId, payload),
    onSuccess: () => {
      notify("Event aktualisiert", "success");
      queryClient.invalidateQueries();
    },
    onError: () => notify("Event konnte nicht aktualisiert werden", "error")
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
  const getEventEdit = (eventId: string, event: { name: string; beginDate?: string; endDate?: string; customTables?: boolean }) => {
    return eventEdits[eventId] || {
      name: event.name || "",
      beginDate: event.beginDate || "",
      endDate: event.endDate || "",
      customTables: event.customTables ?? true
    };
  };
  const setEventEdit = (eventId: string, updates: Partial<{
    name: string;
    beginDate: string;
    endDate: string;
    customTables: boolean;
  }>) => {
    setEventEdits((prev) => {
      const next = { ...prev };
      next[eventId] = { ...(prev[eventId] || {}), ...updates } as {
        name: string;
        beginDate: string;
        endDate: string;
        customTables: boolean;
      };
      return next;
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Events</h1>
      <p className="text-slate-500 mb-6">Events verwalten, aktivieren oder mit Daten duplizieren.</p>
      <LoadingNotice active={isLoading} />

      <div className="rounded-xl border border-slate-200 bg-white p-5 mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Aktive Events</h2>
        {events.length === 0 ? (
          <p className="text-sm text-slate-500">Noch keine Events vorhanden.</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => {
              const isActive = event.id === activeEventId;
              const edit = getEventEdit(event.id, event);
              const isUpdating = updateEventMutation.isPending
                && updateEventMutation.variables?.eventId === event.id;
              const hasChanges = (
                edit.name.trim() !== event.name ||
                edit.beginDate !== (event.beginDate || "") ||
                edit.endDate !== (event.endDate || "") ||
                edit.customTables !== (event.customTables ?? true)
              );
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
                      onClick={() => {
                        setEventEdit(event.id, getEventEdit(event.id, event));
                        setEditingEventId(event.id);
                      }}
                      className="h-9 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Bearbeiten
                    </button>
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

      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateDialog(true)}
          className="h-10 rounded-lg bg-primary-500 px-5 text-sm font-semibold text-white hover:bg-primary-600"
        >
          Neues Event
        </button>
      </div>

      <Dialog
        open={!!editingEventId}
        onClose={() => setEditingEventId(null)}
        title={<h3 className="text-lg font-bold text-slate-800">Event bearbeiten</h3>}
        actions={(
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setEditingEventId(null)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Schließen
            </button>
            <button
              type="button"
              disabled={!editingEventId}
              onClick={() => {
                if (!editingEventId) return;
                const event = events.find((item) => item.id === editingEventId);
                if (!event) return;
                const edit = getEventEdit(event.id, event);
                const isActive = event.id === activeEventId;
                const hasChanges = (
                  edit.name.trim() !== event.name ||
                  edit.beginDate !== (event.beginDate || "") ||
                  edit.endDate !== (event.endDate || "") ||
                  edit.customTables !== (event.customTables ?? true)
                );
                if (!isActive || !hasChanges || updateEventMutation.isPending) return;
                updateEventMutation.mutate({
                  eventId: event.id,
                  payload: {
                    name: edit.name.trim(),
                    beginDate: edit.beginDate || null,
                    endDate: edit.endDate || null,
                    customTables: edit.customTables
                  } as any
                });
                setEditingEventId(null);
              }}
              className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              Speichern
            </button>
          </div>
        )}
      >
        <div className="p-6 space-y-4">
          {(() => {
            const event = events.find((item) => item.id === editingEventId);
            if (!event) {
              return <p className="text-sm text-slate-500">Event nicht gefunden.</p>;
            }
            const edit = getEventEdit(event.id, event);
            const isActive = event.id === activeEventId;
            const disabled = !isActive;
            return (
              <>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {isActive ? "Aktiv" : "Inaktiv"}
                  </span>
                  {!isActive && (
                    <span className="text-xs text-slate-500">Inaktive Events sind schreibgeschützt.</span>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="flex flex-col text-sm text-slate-600">
                    Name
                    <input
                      type="text"
                      value={edit.name}
                      onChange={(e) => setEventEdit(event.id, { name: e.target.value })}
                      disabled={disabled}
                      className="mt-1 h-10 rounded-lg border border-slate-200 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40 disabled:bg-slate-100"
                    />
                  </label>
                  <label className="flex flex-col text-sm text-slate-600">
                    Start
                    <input
                      type="date"
                      value={edit.beginDate}
                      onChange={(e) => setEventEdit(event.id, { beginDate: e.target.value })}
                      disabled={disabled}
                      className="mt-1 h-10 rounded-lg border border-slate-200 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40 disabled:bg-slate-100"
                    />
                  </label>
                  <label className="flex flex-col text-sm text-slate-600">
                    Ende
                    <input
                      type="date"
                      value={edit.endDate}
                      onChange={(e) => setEventEdit(event.id, { endDate: e.target.value })}
                      disabled={disabled}
                      className="mt-1 h-10 rounded-lg border border-slate-200 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40 disabled:bg-slate-100"
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  Start und Ende sind rein informativ und haben keine Auswirkungen auf Bestellungen.
                </p>
                <label className={`flex items-center gap-2 text-sm text-slate-600 ${disabled ? "opacity-50" : ""}`}>
                  <input
                    type="checkbox"
                    checked={edit.customTables}
                    disabled={disabled}
                    onChange={() => setEventEdit(event.id, { customTables: !edit.customTables })}
                  />
                  Benutzerdefinierte Tische
                </label>
                <p className="text-xs text-slate-500">
                  Ermöglicht Bestellungen ohne festen Tisch, z. B. für Stehtische oder freie Bereiche.
                </p>
              </>
            );
          })()}
        </div>
      </Dialog>

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
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        title={<h3 className="text-lg font-bold text-slate-800">Neues Event anlegen</h3>}
        actions={(
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowCreateDialog(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={() => {
                handleCreate();
                if (newEventName.trim()) {
                  setShowCreateDialog(false);
                }
              }}
              disabled={!newEventName.trim() || createEventMutation.isPending}
              className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              Event erstellen
            </button>
          </div>
        )}
      >
        <div className="p-6 space-y-4">
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
          <p className="text-xs text-slate-500">
            Start und Ende sind rein informativ und haben keine Auswirkungen auf Bestellungen.
          </p>
          <div className="space-y-4">
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
          <p className="text-xs text-slate-500">
            Benutzerdefinierte Tische erlauben freie Eingaben wie „Terrasse links“ oder „Barbereich“.
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
