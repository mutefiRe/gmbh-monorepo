import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

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
  user?: unknown;
  printer?: unknown;
  printers?: unknown;
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
  ?? (payload as UpdatePayload).organization?.eventId;

export const useRealtimeUpdates = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: { token },
      query: { token }
    });

    const isEventMismatch = (payload: UpdatePayload | DeletePayload) => {
      const payloadEventId = getPayloadEventId(payload);
      if (!payloadEventId) return false;
      const currentEventId = api.getEventId();
      if (!currentEventId) return false;
      return payloadEventId !== currentEventId;
    };

    const handleUpdate = (payload: UpdatePayload) => {
      if (!payload || isEventMismatch(payload)) return;
      if (payload.item) queryClient.invalidateQueries({ queryKey: ["items"] });
      if (payload.category) queryClient.invalidateQueries({ queryKey: ["categories"] });
      if (payload.unit) queryClient.invalidateQueries({ queryKey: ["units"] });
      if (payload.area) queryClient.invalidateQueries({ queryKey: ["areas"] });
      if (payload.table) queryClient.invalidateQueries({ queryKey: ["tables"] });
      if (payload.organization) queryClient.invalidateQueries({ queryKey: ["organizations"] });
      if (payload.user) queryClient.invalidateQueries({ queryKey: ["users"] });
      if (payload.printer || payload.printers) queryClient.invalidateQueries({ queryKey: ["printers"] });
      if (payload.type === "order") queryClient.invalidateQueries({ queryKey: ["orders"] });
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
        case "printer":
          queryClient.invalidateQueries({ queryKey: ["printers"] });
          break;
        case "user":
          queryClient.invalidateQueries({ queryKey: ["users"] });
          break;
        case "order":
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          break;
        default:
          break;
      }
    };

    socket.on("update", handleUpdate);
    socket.on("delete", handleDelete);
    socket.connect();

    return () => {
      socket.off("update", handleUpdate);
      socket.off("delete", handleDelete);
      socket.disconnect();
    };
  }, [queryClient, token]);
};
