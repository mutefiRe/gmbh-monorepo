import React from "react";
import type { Category } from "@/types/models";
import { getCategoryColor } from "../../../lib/colors";

interface CategoryListProps {
  categories?: Category[];
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const handleChangeCategory = (category: Category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="w-full flex flex-row gap-2 mb-4 overflow-x-auto mt-2 px-2">
      {/* All tab */}
      <button
        key="all"
        onClick={() => setSelectedCategory(null)}
        className={`flex flex-col items-center px-4 py-2 rounded-lg border transition-colors duration-150 min-w-[80px] focus:outline-none shadow border-2`}
        style={
          !selectedCategory
            ? {
              background: '#777777ff',
              color: '#ffffffff',
              borderColor: '#000000ff',
            }
            : {
              background: '#fff',
              color: '#1e293b',
              borderColor: '#d1d5db',
            }
        }
      >
        <span className="text-3xl">🔎</span>
        <span className="text-sm font-semibold">Alle</span>
      </button>
      {Array.isArray(categories) &&
        categories.map((category) => {
          const selected = selectedCategory?.id === category.id;
          const colors = getCategoryColor(category);
          return (
            <button
              key={category.id}
              onClick={() => handleChangeCategory(category)}
              className={`flex flex-col items-center px-4 py-2 rounded-lg border-2  transition-all duration-150 min-w-[80px] focus:outline-none shadow`}
              style={
                selected
                  ? {
                    background: colors.bright,
                    color: colors.brightContrast,
                    borderColor: colors.color,
                  }
                  : {
                    background: '#fff',
                    color: '#1e293b',
                    borderColor: colors.color,
                  }
              }
            >
              <span className="text-3xl">{category.icon || '❓'}</span>
              <span className="text-sm font-semibold">{category.name}</span>
            </button>
          );
        })}
    </div>
  );
};
