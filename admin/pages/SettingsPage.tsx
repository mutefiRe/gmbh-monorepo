export function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Einstellungen</h1>
      <p className="text-slate-500 mb-6">Globale Einstellungen und Systemhinweise.</p>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Events verwalten</h2>
        <p className="text-sm text-slate-600">
          Events werden jetzt im Bereich <span className="font-semibold">Events</span> verwaltet.
          Dort können Sie Events anlegen, aktivieren oder löschen.
        </p>
      </div>
    </div>
  );
}
