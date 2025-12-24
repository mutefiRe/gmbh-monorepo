import { Card } from "../../ui/card";

type SettingsProps = {
  fontScale: number;
  onFontScaleChange: (scale: number) => void;
};

const fontScaleOptions = [90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];

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
              className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${fontScale === option
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

    </div>
  );
}
