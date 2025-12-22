import { useCallback, useEffect, useMemo, useState } from "react";
import { useNotifications } from "../types/queries";

const getLastSeenKey = (eventId?: string | null) =>
  `gmbh-waiter-notifications-last-seen:${eventId || "default"}`;

export function useUnreadNotifications(eventId?: string | null, enabled = true, limit = 50) {
  const storageKey = getLastSeenKey(eventId);
  const [lastSeen, setLastSeen] = useState(0);
  const [latestRealtimeTs, setLatestRealtimeTs] = useState(0);
  const latestNotification = useNotifications(0, limit, { enabled });
  const notifications = latestNotification.data?.notifications || [];
  const latestCreatedAt = notifications[0]?.createdAt;
  const latestTimestamp = latestCreatedAt ? new Date(latestCreatedAt).getTime() : 0;

  useEffect(() => {
    // Hydrate last-seen from storage when the event scope changes.
    const raw = localStorage.getItem(storageKey);
    setLastSeen(raw ? Number(raw) : 0);
    setLatestRealtimeTs(0);
  }, [storageKey]);

  useEffect(() => {
    // Keep multiple tabs in sync when notifications are marked as seen.
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ ts?: number }>;
      if (customEvent.detail?.ts) {
        setLastSeen(customEvent.detail.ts);
      }
    };
    window.addEventListener("gmbh-notifications-seen", handler);
    return () => window.removeEventListener("gmbh-notifications-seen", handler);
  }, []);

  useEffect(() => {
    // Track new notifications pushed over sockets without waiting for refetch.
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ ts?: string }>;
      if (!customEvent.detail?.ts) return;
      const parsed = new Date(customEvent.detail.ts).getTime();
      if (Number.isFinite(parsed)) {
        setLatestRealtimeTs((prev) => Math.max(prev, parsed));
      }
    };
    window.addEventListener("gmbh-notification-received", handler);
    return () => window.removeEventListener("gmbh-notification-received", handler);
  }, []);

  const effectiveLatest = useMemo(
    () => Math.max(latestTimestamp, latestRealtimeTs),
    [latestTimestamp, latestRealtimeTs]
  );

  const markSeen = useCallback((createdAt?: string) => {
    // Persist a timestamp so unread indicators survive reloads per event.
    const parsed = createdAt ? new Date(createdAt).getTime() : Date.now();
    const ts = Number.isFinite(parsed) ? parsed : Date.now();
    localStorage.setItem(storageKey, String(ts));
    setLastSeen(ts);
    window.dispatchEvent(new CustomEvent("gmbh-notifications-seen", { detail: { ts } }));
  }, [storageKey]);

  const hasUnread = effectiveLatest > lastSeen;
  const unreadCount = hasUnread ? 1 : 0;
  const unreadLabel = unreadCount > 0 ? String(unreadCount) : "";

  return {
    hasUnread,
    lastSeen,
    latestTimestamp: effectiveLatest,
    markSeen,
    unreadCount,
    unreadLabel
  };
}
