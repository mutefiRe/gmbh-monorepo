import type { Category } from "../types/models";

// Utility functions for color calculations
export function getTextColor(hex: string) {
  if (!hex) return "black";
  const R = parseInt(hex.substring(1, 3), 16);
  const G = parseInt(hex.substring(3, 5), 16);
  const B = parseInt(hex.substring(5, 7), 16);
  const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  return luminance > 127 ? "black" : "white";
}

export function modifyBrightness(hex: string, percent: number) {
  if (!hex) return hex;
  const num = parseInt(hex.slice(1), 16);
  let r = (num >> 16) + Math.round(255 * percent);
  let g = ((num >> 8) & 0x00FF) + Math.round(255 * percent);
  let b = (num & 0x0000FF) + Math.round(255 * percent);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

type CategoryColor = {
  color: string;
  contrast: string;
  bright: string;
  brightContrast: string;
  dark: string;
};

// probably premature optimization but whatever
const categoryColorCache: Record<string, CategoryColor> = {};

export function getCategoryColor(category?: Category): CategoryColor {
  const id = category?.id || "";
  if (categoryColorCache[id]) {
    return categoryColorCache[id];
  }
  const color = category?.color || '#000000';
  const textcolor = getTextColor(color);
  const brightcolor = modifyBrightness(color, 0.8);
  const brightContrast = getTextColor(brightcolor);
  const darkcolor = modifyBrightness(color, -0.5);
  const result = {
    color,
    contrast: textcolor,
    bright: brightcolor,
    brightContrast,
    dark: darkcolor
  };
  categoryColorCache[id] = result;
  return result;
}

