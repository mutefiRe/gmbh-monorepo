import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

const FONT_SCALE_KEY = "waiter_font_scale";

export function useFontScale(defaultScale = 100) {
  const [fontScale, setFontScale] = useLocalStorage<number>(FONT_SCALE_KEY, defaultScale);

  useEffect(() => {
    const normalized = Math.min(140, Math.max(80, fontScale));
    document.documentElement.style.fontSize = `${normalized}%`;
  }, [fontScale]);

  return [fontScale, setFontScale] as const;
}
