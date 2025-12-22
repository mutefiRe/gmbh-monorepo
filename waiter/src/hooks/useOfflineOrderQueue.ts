import { useEffect, useState } from "react";
import { getOfflineOrders, subscribeOfflineOrders } from "../lib/offlineOrders";
import { getOfflinePayments, subscribeOfflinePayments } from "../lib/offlinePayments";
import { useAuth } from "../auth-wrapper";

export function useOfflineOrderQueue() {
  const auth = useAuth();
  const scope = { userId: auth.userId ?? null, eventId: auth.eventId ?? null };
  const [pendingOrders, setPendingOrders] = useState(() => getOfflineOrders(scope).length);
  const [pendingPayments, setPendingPayments] = useState(() => getOfflinePayments(scope).length);

  useEffect(() => {
    const update = () => {
      setPendingOrders(getOfflineOrders(scope).length);
      setPendingPayments(getOfflinePayments(scope).length);
    };
    const unsubscribeOrders = subscribeOfflineOrders(update);
    const unsubscribePayments = subscribeOfflinePayments(update);
    update();
    return () => {
      unsubscribeOrders();
      unsubscribePayments();
    };
  }, [scope.eventId, scope.userId]);

  return { pendingCount: pendingOrders + pendingPayments, pendingOrders, pendingPayments };
}
