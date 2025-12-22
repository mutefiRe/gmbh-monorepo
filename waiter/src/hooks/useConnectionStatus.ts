import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../auth-wrapper";

export type ConnectionState = {
  isOnline: boolean;
  isServerReachable: boolean;
  canReachServer: boolean;
  status: "online" | "offline" | "server-unreachable" | "checking";
};

const PING_INTERVAL_MS = 10000;
const PING_TIMEOUT_MS = 3000;

// useConnectionStatusCheck provides real-time information about the application's connection status,
// Please use useConnectionStatus from ConnectionStatusContext instead of this hook directly.
export function useConnectionStatusCheck(): ConnectionState {
  const auth = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isServerReachable, setIsServerReachable] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const prevReachableRef = useRef<boolean>(true);

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
        prevReachableRef.current = false;
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
          if (!prevReachableRef.current) {
            setIsServerReachable(true);
            prevReachableRef.current = true;
          }
        } else {
          if (prevReachableRef.current) {
            setIsServerReachable(false);
            prevReachableRef.current = false;
          }
        }
      } catch (error) {
        if (prevReachableRef.current) {
          setIsServerReachable(false);
          prevReachableRef.current = false;
        }
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
  }, [isOnline]);

  const status = useMemo<ConnectionState["status"]>(() => {
    if (!isOnline) return "offline";
    if (isChecking) return "checking";
    return isServerReachable ? "online" : "server-unreachable";
  }, [isOnline, isChecking, isServerReachable]);

  const canReachServer = isOnline && isServerReachable;

  return { isOnline, isServerReachable, canReachServer, status };
}
