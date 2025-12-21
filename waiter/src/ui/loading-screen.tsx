import { Card } from "./card";

type LoadingScreenProps = {
  title?: string;
  subtitle?: string;
};

export function LoadingScreen({
  title = "Daten werden geladen",
  subtitle = "Bitte einen Moment warten.",
}: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg rounded-2xl overflow-hidden">
        <div className="bg-primary-600 p-6 text-center">
          <div className="mx-auto mb-3 h-10 w-36 rounded-full bg-white/30 animate-pulse" />
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          <p className="text-primary-200 text-sm mt-1">{subtitle}</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-3 w-32 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-7 w-24 rounded-full bg-slate-200 animate-pulse" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-200 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-3 w-1/2 rounded-full bg-slate-200 animate-pulse" />
                </div>
                <div className="h-6 w-12 rounded-full bg-slate-200 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="h-10 w-full rounded-xl bg-slate-200 animate-pulse" />
        </div>
      </Card>
    </div>
  );
}
