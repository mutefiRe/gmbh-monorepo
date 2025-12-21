import { apiFetch } from "../types/queries";

export type OfflineOrderPayload = {
  id: string;
  tableId: string;
  orderitems: {
    id?: string;
    itemId: string;
    count: number;
    countPaid?: number;
    countFree?: number;
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

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readQueue(scope?: QueueScope): OfflineOrder[] {
  const raw = localStorage.getItem(resolveKey(scope));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    let mutated = false;
    const normalized = parsed.map((entry: OfflineOrder) => {
      let entryMutated = false;
      const orderitems = entry.order?.orderitems || [];
      const updatedItems = orderitems.map((item) => {
        const next = {
          ...item,
          id: item.id || generateId(),
          countPaid: item.countPaid ?? 0,
          countFree: item.countFree ?? 0
        };
        if (next.id !== item.id || next.countPaid !== item.countPaid || next.countFree !== item.countFree) {
          entryMutated = true;
        }
        return next;
      });
      if (entryMutated) {
        mutated = true;
        return { ...entry, order: { ...entry.order, orderitems: updatedItems } };
      }
      return entry;
    });
    if (mutated) {
      localStorage.setItem(resolveKey(scope), JSON.stringify(normalized));
    }
    return normalized;
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

export function getOfflineOrderById(orderId: string, scope?: QueueScope) {
  return readQueue(scope).find((entry) => entry.id === orderId) || null;
}

export function updateOfflineOrderCounts(
  orderId: string,
  updates: Array<{ id: string; countPaidDelta: number; countFreeDelta?: number }>,
  scope?: QueueScope
) {
  const queue = readQueue(scope);
  const entry = queue.find((item) => item.id === orderId);
  if (!entry) return;
  const orderitems = entry.order?.orderitems || [];
  const updatedItems = orderitems.map((item) => {
    const update = updates.find((candidate) => candidate.id === item.id);
    if (!update) return item;
    const nextPaid = Math.max(0, (item.countPaid ?? 0) + update.countPaidDelta);
    const nextFree = Math.max(0, (item.countFree ?? 0) + (update.countFreeDelta ?? 0));
    return {
      ...item,
      countPaid: Math.min(item.count, nextPaid),
      countFree: Math.min(item.count, nextFree)
    };
  });
  entry.order = { ...entry.order, orderitems: updatedItems };
  writeQueue(queue, scope);
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
