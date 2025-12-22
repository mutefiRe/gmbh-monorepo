import { Card } from "../../ui/card";

type SettingsProps = {
  fontScale: number;
  onFontScaleChange: (scale: number) => void;
};

const fontScaleOptions = [90, 100, 110, 120, 130];

export function Settings({ fontScale, onFontScaleChange }: SettingsProps) {
  return (
    <div className="p-4">
      <Card className="p-4">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Anzeige</h2>
        <div className="flex flex-wrap gap-2">
          {fontScaleOptions.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => onFontScaleChange(option)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                fontScale === option
                  ? "bg-primary-50 border-primary-300 text-primary-700"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {option}%
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Schriftgröße betrifft die gesamte Oberfläche.
        </p>
      </Card>

      <Card className="p-4 mt-4">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Kiosk-App</h2>
        <p className="text-sm text-slate-600">
          Für stabile Kiosk-Nutzung empfehlen wir eine Kiosk-App.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <a
            className="inline-flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            href="https://f-droid.org/repo/uk.nktnet.webviewkiosk_105.apk"
            target="_blank"
            rel="noreferrer"
          >
            WebView Kiosk (Android 5+)
            <span className="text-xs text-slate-500">APK</span>
          </a>
          <a
            className="inline-flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            href="https://freekiosk.app/download/"
            target="_blank"
            rel="noreferrer"
          >
            FreeKiosk (Android)
            <span className="text-xs text-slate-500">Android 8+</span>
          </a>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Hinweis: Für Android 5 bitte WebView Kiosk verwenden.
        </p>
      </Card>
    </div>
  );
}
