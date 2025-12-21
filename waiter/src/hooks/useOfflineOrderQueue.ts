import { useEffect, useState } from "react";
import { getOfflineOrders, subscribeOfflineOrders } from "../lib/offlineOrders";
import { getOfflinePayments, subscribeOfflinePayments } from "../lib/offlinePayments";
import { useAuth } from "../auth-wrapper";

export function useOfflineOrderQueue() {
  const auth = useAuth();
  const scope = { userId: auth.userId ?? null, eventId: auth.eventId ?? null };
  const [pendingCount, setPendingCount] = useState(() => getOfflineOrders(scope).length + getOfflinePayments(scope).length);

  useEffect(() => {
    const update = () => setPendingCount(getOfflineOrders(scope).length + getOfflinePayments(scope).length);
    const unsubscribeOrders = subscribeOfflineOrders(update);
    const unsubscribePayments = subscribeOfflinePayments(update);
    update();
    return () => {
      unsubscribeOrders();
      unsubscribePayments();
    };
  }, [scope.eventId, scope.userId]);

  return { pendingCount };
}
