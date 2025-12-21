import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Bell, LayoutGrid, Tag, Utensils } from "lucide-react";
import { useNotifications } from "../../types/queries";
import type { Notification } from "../../types/models";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { useAuth } from "../../auth-wrapper";
import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";

const PAGE_SIZE = 5;
const iconMap: Record<string, ReactNode> = {
  category: <Tag size={18} />,
  item: <Utensils size={18} />,
  area: <LayoutGrid size={18} />,
  table: <LayoutGrid size={18} />
};

const formatRelativeTime = (value?: string) => {
  if (!value) return "unbekannt";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unbekannt";
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "gerade eben";
  if (diffMin < 60) return `vor ${diffMin} Min`;
  const diffHours = Math.floor(diffMin / 60);
  return `vor ${diffHours} Std`;
};

const actionLabel = (notification: Notification) => {
  switch (notification.action) {
    case "priceChanged":
      return "Preis geändert";
    case "deactivated":
      return "Deaktiviert";
    case "created":
      return "Neu";
    default:
      return "Update";
  }
};

export function Notifications() {
  const [page, setPage] = useState(0);
  const auth = useAuth();
  const storageKey = useMemo(
    () => `gmbh-waiter-notifications-last-seen:${auth.eventId || "default"}`,
    [auth.eventId]
  );
  const { markSeen, lastSeen } = useUnreadNotifications(auth.eventId, true);
  const initialLastSeenRef = useRef<number | null>(null);
  const { data, isLoading, isError } = useNotifications(page * PAGE_SIZE, PAGE_SIZE);
  const notifications = data?.notifications || [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (initialLastSeenRef.current === null) {
      const stored = localStorage.getItem(storageKey);
      initialLastSeenRef.current = stored ? Number(stored) : lastSeen;
    }
    return () => {
      markSeen();
    };
  }, [lastSeen, markSeen, storageKey]);

  if (isLoading) {
    return (
      <div className="p-4">
        <Card className="p-4 animate-pulse">
          <div className="h-5 w-48 rounded-full bg-slate-200 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 rounded-full bg-slate-200" />
                  <div className="h-3 w-1/3 rounded-full bg-slate-200" />
                </div>
                <div className="h-6 w-16 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-xl border border-red-100 text-red-600 p-4 text-sm">
          Hinweise konnten nicht geladen werden.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card className="overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Bell size={18} />
            <span>Benachrichtigungen</span>
          </div>
          <span className="text-xs text-slate-400">letzte 2 Stunden</span>
        </div>
        <div className="divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-slate-500">
              Keine neuen Hinweise in den letzten 2 Stunden.
            </div>
          ) : (
            notifications.map((notification) => {
              const createdAt = notification.createdAt ? new Date(notification.createdAt).getTime() : 0;
              const baseline = initialLastSeenRef.current ?? lastSeen;
              const isNew = createdAt > baseline;
              return (
                <div
                  key={notification.id}
                  className={`p-4 flex items-start gap-3 ${isNew ? "bg-primary-50/70" : ""}`}
                >
                <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center">
                  {iconMap[notification.entityType] || <Bell size={18} />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800">
                    {notification.message}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {actionLabel(notification)} · {formatRelativeTime(notification.createdAt)}
                  </div>
                  {notification.meta && notification.action === "priceChanged" ? (
                    <div className="text-xs text-slate-500 mt-1">
                      {String(notification.meta?.from)} → {String(notification.meta?.to)}
                    </div>
                  ) : null}
                </div>
              </div>
            );
            })
          )}
        </div>
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Seite {Math.min(page + 1, totalPages)} von {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="px-3 py-1.5 rounded-lg text-sm font-semibold"
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
            >
              Zurück
            </Button>
            <Button
              type="button"
              variant="outline"
              className="px-3 py-1.5 rounded-lg text-sm font-semibold"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={page + 1 >= totalPages}
            >
              Weiter
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
