import { apiFetch } from "../types/queries";
import { getOfflineOrders } from "./offlineOrders";

export type OfflinePayment = {
  id: string;
  createdAt: string;
  userId: string | null;
  eventId: string | null;
  orderId: string;
  order: {
    id: string;
    orderitems: {
      id: string;
      price: number;
      countPaid: number;
      countFree: number;
      count: number;
    }[];
  };
};

const STORAGE_KEY = "gmbh-offline-payments";
const QUEUE_EVENT = "gmbh-offline-payments-changed";

type QueueScope = {
  userId?: string | null;
  eventId?: string | null;
};

function resolveKey(scope?: QueueScope) {
  if (!scope) return STORAGE_KEY;
  const user = scope.userId || "anon";
  const event = scope.eventId || "none";
  return `${STORAGE_KEY}:${user}:${event}`;
}

function readQueue(scope?: QueueScope): OfflinePayment[] {
  const raw = localStorage.getItem(resolveKey(scope));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function writeQueue(queue: OfflinePayment[], scope?: QueueScope) {
  localStorage.setItem(resolveKey(scope), JSON.stringify(queue));
  window.dispatchEvent(new Event(QUEUE_EVENT));
}

export function getOfflinePayments(scope?: QueueScope) {
  return readQueue(scope);
}

export function hasPendingPayment(orderId: string, scope?: QueueScope) {
  return readQueue(scope).some((entry) => entry.orderId === orderId);
}

export function enqueueOfflinePayment(payment: OfflinePayment, scope?: QueueScope) {
  const queue = readQueue(scope);
  queue.push(payment);
  writeQueue(queue, scope);
}

export function clearOfflinePayments(scope?: QueueScope) {
  writeQueue([], scope);
}

export function subscribeOfflinePayments(callback: () => void) {
  const handler = () => callback();
  window.addEventListener(QUEUE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(QUEUE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export async function flushOfflinePayments(scope?: QueueScope) {
  const queue = readQueue(scope);
  if (queue.length === 0) return;
  const remaining: OfflinePayment[] = [];
  const pendingOrders = new Set(getOfflineOrders(scope).map((entry) => entry.id));
  for (let index = 0; index < queue.length; index += 1) {
    const entry = queue[index];
    if (pendingOrders.has(entry.orderId)) {
      remaining.push(entry);
      continue;
    }
    try {
      await apiFetch(`/api/orders/${entry.orderId}`, {
        method: "PUT",
        body: JSON.stringify({ order: entry.order })
      });
    } catch (error) {
      remaining.push(...queue.slice(index));
      break;
    }
  }
  writeQueue(remaining, scope);
}
