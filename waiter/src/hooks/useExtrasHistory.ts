import { useLocalStorage } from "./useLocalStorage";

type ExtrasHistory = Record<string, string[]>;

const EXTRAS_HISTORY_KEY = "waiter_item_extras_history";

function normalizeExtras(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function useExtrasHistory() {
  const [extrasHistory, setExtrasHistory] = useLocalStorage<ExtrasHistory>(EXTRAS_HISTORY_KEY, {});

  function recordExtrasForItems(items: Array<{ itemId: string; extras?: string | null }>) {
    setExtrasHistory(prev => {
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
      return next;
    });
  }

  function getSuggestions(itemId: string) {
    return extrasHistory[String(itemId)] || [];
  }

  return { extrasHistory, getSuggestions, recordExtrasForItems };
}
