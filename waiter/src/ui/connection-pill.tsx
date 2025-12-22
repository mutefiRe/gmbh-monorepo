type ConnectionPillProps = {
  status: "online" | "offline" | "server-unreachable" | "checking";
  pendingCount?: number;
  compact?: boolean;
};

export function ConnectionPill({ status, pendingCount = 0, compact = false }: ConnectionPillProps) {
  const showPending = !compact && pendingCount > 0;

  if (status === "checking") {
    return (
      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-500">
        Prüfe Verbindung...
      </span>
    );
  }

  if (status === "online") {
    return (
      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
        Verbunden{showPending ? ` · ${pendingCount} ausstehend` : ""}
      </span>
    );
  }

  if (status === "server-unreachable") {
    return (
      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700">
        Server nicht erreichbar{showPending ? ` · ${pendingCount} ausstehend` : ""}
      </span>
    );
  }

  return (
    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-rose-100 text-rose-700">
      Offline{showPending ? ` · ${pendingCount} ausstehend` : ""}
    </span>
  );
}
