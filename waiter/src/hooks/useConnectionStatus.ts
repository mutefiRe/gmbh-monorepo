import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth-wrapper";

type ConnectionState = {
  isOnline: boolean;
  isServerReachable: boolean;
  canReachServer: boolean;
  status: "online" | "offline" | "server-unreachable" | "checking";
};

const PING_INTERVAL_MS = 10000;
const PING_TIMEOUT_MS = 3000;

export function useConnectionStatus(): ConnectionState {
  const auth = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isServerReachable, setIsServerReachable] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    const ping = async () => {
      if (!isOnline) {
        setIsServerReachable(false);
        return;
      }
      setIsChecking(true);
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (auth.token) {
          headers["x-access-token"] = auth.token;
        }
        if (auth.eventId) {
          headers["x-event-id"] = auth.eventId;
        }
        const res = await fetch("/api/healthz", {
          method: "GET",
          headers,
          signal: controller.signal,
        });
        if (res.ok || res.status === 401 || res.status === 403) {
          setIsServerReachable(true);
        } else {
          setIsServerReachable(false);
        }
      } catch (error) {
        setIsServerReachable(false);
      } finally {
        window.clearTimeout(timeout);
        setIsChecking(false);
      }
    };

    ping();
    interval = window.setInterval(ping, PING_INTERVAL_MS);
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [auth.eventId, auth.token, isOnline]);

  const status = useMemo<ConnectionState["status"]>(() => {
    if (!isOnline) return "offline";
    if (isChecking) return "checking";
    return isServerReachable ? "online" : "server-unreachable";
  }, [isOnline, isChecking, isServerReachable]);

  const canReachServer = isOnline && isServerReachable;

  return { isOnline, isServerReachable, canReachServer, status };
}
