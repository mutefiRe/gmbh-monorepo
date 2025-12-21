import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth-wrapper";

type UpdatePayload = {
  eventId?: string;
  type?: string;
  id?: string | number;
  item?: { eventId?: string };
  category?: { eventId?: string };
  unit?: { eventId?: string };
  area?: { eventId?: string };
  table?: { eventId?: string };
  organization?: { eventId?: string };
  notification?: { eventId?: string };
};

type DeletePayload = {
  eventId?: string;
  type?: string;
  id?: string | number;
};

const SOCKET_URL = window.location.origin;

const getPayloadEventId = (payload: UpdatePayload | DeletePayload) =>
  payload.eventId
  ?? (payload as UpdatePayload).item?.eventId
  ?? (payload as UpdatePayload).category?.eventId
  ?? (payload as UpdatePayload).unit?.eventId
  ?? (payload as UpdatePayload).area?.eventId
  ?? (payload as UpdatePayload).table?.eventId
  ?? (payload as UpdatePayload).organization?.eventId
  ?? (payload as UpdatePayload).notification?.eventId;

export const useRealtimeUpdates = () => {
  const auth = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!auth.token) return;

    const socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: { token: auth.token },
      query: { token: auth.token }
    });

    const isEventMismatch = (payload: UpdatePayload | DeletePayload) => {
      // Prevent cross-event updates from mutating the current event's cache.
      const payloadEventId = getPayloadEventId(payload);
      if (!payloadEventId || !auth.eventId) return false;
      return payloadEventId !== auth.eventId;
    };

    const handleUpdate = (payload: UpdatePayload) => {
      if (!payload || isEventMismatch(payload)) return;
      if (payload.notification) {
        // Push notification updates into the unread tracker without forcing a full refetch.
        queryClient.invalidateQueries({ queryKey: ["notifications"], exact: false });
        const createdAt = (payload.notification as any)?.createdAt;
        if (createdAt) {
          window.dispatchEvent(new CustomEvent("gmbh-notification-received", { detail: { ts: createdAt } }));
        }
      }
      if (payload.item) queryClient.invalidateQueries({ queryKey: ["items"] });
      if (payload.category) queryClient.invalidateQueries({ queryKey: ["categories"] });
      if (payload.unit) queryClient.invalidateQueries({ queryKey: ["units"] });
      if (payload.area) queryClient.invalidateQueries({ queryKey: ["areas"] });
      if (payload.table) queryClient.invalidateQueries({ queryKey: ["tables"] });
      if (payload.organization) queryClient.invalidateQueries({ queryKey: ["organizations"] });
      if (payload.type === "order") {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        if (payload.id) {
          queryClient.invalidateQueries({ queryKey: ["order", payload.id] });
        }
      }
    };

    const handleDelete = (payload: DeletePayload) => {
      if (!payload || isEventMismatch(payload)) return;
      switch (payload.type) {
        case "item":
          queryClient.invalidateQueries({ queryKey: ["items"] });
          break;
        case "category":
          queryClient.invalidateQueries({ queryKey: ["categories"] });
          break;
        case "unit":
          queryClient.invalidateQueries({ queryKey: ["units"] });
          break;
        case "area":
          queryClient.invalidateQueries({ queryKey: ["areas"] });
          break;
        case "table":
          queryClient.invalidateQueries({ queryKey: ["tables"] });
          break;
        case "organization":
          queryClient.invalidateQueries({ queryKey: ["organizations"] });
          break;
        case "order":
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          if (payload.id) {
            queryClient.invalidateQueries({ queryKey: ["order", payload.id] });
          }
          break;
        default:
          break;
      }
    };

    socket.on("update", handleUpdate);
    socket.on("delete", handleDelete);
    socket.on("notification", handleUpdate);
    socket.connect();

    return () => {
      socket.off("update", handleUpdate);
      socket.off("delete", handleDelete);
      socket.off("notification", handleUpdate);
      socket.disconnect();
    };
  }, [auth.eventId, auth.token, queryClient]);
};
