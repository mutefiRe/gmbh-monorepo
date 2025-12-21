import { apiFetch } from "../types/queries";

export type OfflineOrderPayload = {
  id: string;
  tableId: string;
  orderitems: {
    itemId: string;
    count: number;
    extras?: string | null;
    price: number;
  }[];
};

type OfflineOrder = {
  id: string;
  createdAt: string;
  userId: string | null;
  eventId: string | null;
  printId: string;
  order: OfflineOrderPayload;
};

const STORAGE_KEY = "gmbh-offline-orders";
const QUEUE_EVENT = "gmbh-offline-orders-changed";

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

function readQueue(scope?: QueueScope): OfflineOrder[] {
  const raw = localStorage.getItem(resolveKey(scope));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function writeQueue(queue: OfflineOrder[], scope?: QueueScope) {
  localStorage.setItem(resolveKey(scope), JSON.stringify(queue));
  window.dispatchEvent(new Event(QUEUE_EVENT));
}

export function getOfflineOrders(scope?: QueueScope) {
  return readQueue(scope);
}

export function enqueueOfflineOrder(order: OfflineOrder, scope?: QueueScope) {
  const queue = readQueue(scope);
  queue.push(order);
  writeQueue(queue, scope);
}

export function clearOfflineOrders(scope?: QueueScope) {
  writeQueue([], scope);
}

export function subscribeOfflineOrders(callback: () => void) {
  const handler = () => callback();
  window.addEventListener(QUEUE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(QUEUE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export async function flushOfflineOrders(scope?: QueueScope) {
  const queue = readQueue(scope);
  if (queue.length === 0) return;
  const remaining: OfflineOrder[] = [];
  for (let index = 0; index < queue.length; index += 1) {
    const entry = queue[index];
    try {
      const created = await apiFetch<{ order: { id: string } }>("/api/orders", {
        method: "POST",
        body: JSON.stringify({ order: entry.order })
      });
      void created;
    } catch (error) {
      remaining.push(...queue.slice(index));
      break;
    }
  }
  writeQueue(remaining, scope);
}
