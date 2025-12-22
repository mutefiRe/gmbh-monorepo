export function Intro() {
  return (
    <div className="p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Einführung</h2>
          <p className="text-sm text-slate-500">Kurzer Überblick für den Schnellstart.</p>
        </div>
        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <p className="font-semibold text-slate-800">1. Bestellung aufnehmen</p>
            <p>Kategorie wählen, Artikel antippen. Langdruck öffnet Extras und Menge.</p>
            <p>Hinweis: Tap im Vorschau‑Bereich markiert einen Artikel für -1/Löschen.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">2. Vorschau prüfen</p>
            <p>In der Vorschau siehst du Mengen und Extras. Antippen zeigt -1/Löschen.</p>
            <p>Du kannst mehrere Positionen schnell korrigieren, ohne die Ansicht zu verlassen.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">3. Tisch wählen</p>
            <p>Im Bestell‑Detail den Tisch auswählen. Danach „Bestellung abschicken“.</p>
            <p>Fehlt ein Tisch? Wähle den Bereich oben, dann den passenden Tisch.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">4. Bezahlen</p>
            <p>Unter „Letzte Bestellungen“ eine Bestellung öffnen und Positionen markieren.</p>
            <p>Mit „Ausgewählte bezahlen“ wird nur der markierte Teil bezahlt.</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-4 text-sm text-slate-700">
          <div>
            <p className="font-semibold text-slate-800">Workflow Tipps</p>
            <p>Extras werden nach erfolgreichem Abschicken gespeichert und als Vorschläge angezeigt.</p>
            <p>Farben an Kategorien helfen beim schnellen Erkennen von Artikelgruppen.</p>
            <p>Einstellungen findest du im Menü oben links (Zoom/Anzeige).</p>
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
              Wir bieten keine Rechnungen an, da das System keine Registrierkasse ist.
            </div>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Schnell korrigieren</p>
            <p>Im Vorschau‑Bereich kurz antippen, dann -1 oder Löschen wählen.</p>
            <p>Im Detailbereich gleiche Logik, ideal für mehrere Änderungen.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Druck & Kontrolle</p>
            <p>Nach dem Abschicken wird der Druck automatisch ausgelöst.</p>
            <p>Wenn etwas fehlt: Bestellung in „Letzte Bestellungen“ öffnen und prüfen.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
