import { getStorageValue } from "../hooks/useLocalStorage";

type ExtrasHistory = Record<string, string[]>;

export const EXTRAS_HISTORY_KEY = "waiter_item_extras_history";
export const EXTRAS_HISTORY_EVENT = "waiter_item_extras_history_changed";

function normalizeExtras(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function getExtrasHistory(defaultValue: ExtrasHistory = {}) {
  return getStorageValue(EXTRAS_HISTORY_KEY, defaultValue) as ExtrasHistory;
}

export function recordExtrasHistory(items: Array<{ itemId: string; extras?: string | null }>) {
  const prev = getExtrasHistory();
  const next: ExtrasHistory = { ...prev };
  for (const item of items) {
    const extras = normalizeExtras(item.extras);
    if (!extras) {
      continue;
    }
    const key = String(item.itemId);
    const existing = next[key] || [];
    next[key] = [extras, ...existing.filter(entry => entry !== extras)].slice(0, 5);
  }
  localStorage.setItem(EXTRAS_HISTORY_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EXTRAS_HISTORY_EVENT));
}
