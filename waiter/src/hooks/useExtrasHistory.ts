import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { EXTRAS_HISTORY_EVENT, EXTRAS_HISTORY_KEY, getExtrasHistory, recordExtrasHistory } from "../lib/extrasHistory";

type ExtrasHistory = Record<string, string[]>;

export function useExtrasHistory() {
  const [extrasHistory, setExtrasHistory] = useLocalStorage<ExtrasHistory>(EXTRAS_HISTORY_KEY, {});

  function recordExtrasForItems(items: Array<{ itemId: string; extras?: string | null }>) {
    recordExtrasHistory(items);
    setExtrasHistory(getExtrasHistory({}));
  }

  function getSuggestions(itemId: string) {
    return extrasHistory[String(itemId)] || [];
  }

  useEffect(() => {
    const handler = () => setExtrasHistory(getExtrasHistory({}));
    window.addEventListener(EXTRAS_HISTORY_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EXTRAS_HISTORY_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [setExtrasHistory]);

  return { extrasHistory, getSuggestions, recordExtrasForItems };
}
