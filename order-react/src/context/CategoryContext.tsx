import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Category {
  group?: number;
  name?: string;
  price?: number;
  enabled?: boolean;
  color?: string;
  items?: any[];
  // Add other fields as needed
}

interface CategoryContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  modifyBrightness: (color: string, percent: number) => string;
  textcolor: (color: string) => string;
  enabledItems: (items: Category[]) => Category[];
  sortedItems: (items: Category[]) => Category[];
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

function modifyBrightness(color: string, percent: number): string {
  const hex = parseInt(color.slice(1), 16);
  const target = percent < 0 ? 0 : 255;
  const R = hex >> 16;
  const G = (hex >> 8) & 0x00FF;
  const B = hex & 0x0000FF;
  percent = percent < 0 ? percent * -1 : percent;
  return (
    '#' + (
      (Math.round((target - R) * percent) + R) * 0x10000 +
      (Math.round((target - G) * percent) + G) * 0x100 +
      (Math.round((target - B) * percent) + B) +
      0x1000000
    ).toString(16).slice(1)
  );
}

function textcolor(color: string): string {
  const R = parseInt(color.substring(1, 3), 16);
  const G = parseInt(color.substring(3, 5), 16);
  const B = parseInt(color.substring(5, 7), 16);
  const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  return luminance > 127 ? 'black' : 'white';
}

function enabledItems(items: Category[]): Category[] {
  return items.filter(item => item.enabled);
}

function sortedItems(items: Category[]): Category[] {
  return [...items].sort((a, b) => {
    if (a.group !== b.group) return (a.group ?? 0) - (b.group ?? 0);
    if (a.name !== b.name) return (a.name ?? '').localeCompare(b.name ?? '');
    return (a.price ?? 0) - (b.price ?? 0);
  });
}

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);

  return (
    <CategoryContext.Provider value={{ categories, setCategories, modifyBrightness, textcolor, enabledItems, sortedItems }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategories must be used within a CategoryProvider');
  return context;
}
