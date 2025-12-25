import { Card } from "../../ui/card";

type SettingsProps = {
  fontScale: number;
  onFontScaleChange: (scale: number) => void;
  productGridDensity: "standard" | "compact";
  onProductGridDensityChange: (density: "standard" | "compact") => void;
};

const fontScaleOptions = [90, 100, 110, 120, 130, 140];

export function Settings({
  fontScale,
  onFontScaleChange,
  productGridDensity,
  onProductGridDensityChange,
}: SettingsProps) {
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

      <Card className="p-4 mt-4">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Produktgitter</h2>
        <div className="flex flex-wrap gap-2">
          {([
            { value: "standard", label: "Standard" },
            { value: "compact", label: "Kompakt" },
          ] as const).map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => onProductGridDensityChange(option.value)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${productGridDensity === option.value
                  ? "bg-primary-50 border-primary-300 text-primary-700"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Kompakt zeigt ab “S” eine Spalte mehr.
        </p>
      </Card>
    </div>
  );
}
