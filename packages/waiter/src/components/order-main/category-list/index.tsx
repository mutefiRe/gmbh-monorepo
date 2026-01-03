import { Search } from "lucide-react";
import { CategoryIcon } from "../../../ui/category-icon";
import type { Category } from "../../../types/models";
import { getCategoryColor } from "../../../lib/colors";

interface CategoryListProps {
  categories?: Category[];
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
}

export function CategoryList({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoryListProps) {
  const handleChangeCategory = (category: Category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="w-full flex flex-row gap-2 overflow-x-auto px-2 py-0 bg-slate-50/60 border-b border-slate-100">
      {/* All tab */}
      <button
        key="all"
        onClick={() => setSelectedCategory(null)}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors duration-150 shrink-0 whitespace-nowrap focus:outline-none ${!selectedCategory ? 'bg-slate-100 text-slate-900 border-slate-300 ring-1 ring-slate-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
      >
        <Search size={18} />
        <span className="text-sm font-semibold whitespace-nowrap">Alle</span>
      </button>
      {Array.isArray(categories) &&
        categories.map((category) => {
          const selected = selectedCategory?.id === category.id;
          const color = category.color || getCategoryColor(category).color;
          return (
            <button
              key={category.id}
              onClick={() => handleChangeCategory(category)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-150 shrink-0 whitespace-nowrap focus:outline-none ${selected ? 'text-slate-900 ring-1 ring-slate-200' : 'text-slate-700 hover:bg-slate-50'}`}
              style={{
                backgroundColor: selected ? `${color}1a` : '#ffffff',
                borderColor: selected ? color : '#e2e8f0'
              }}
            >
              <CategoryIcon
                name={category.icon}
                className={selected ? 'text-slate-900' : 'text-slate-500'}
                size={20}
                style={{ color: selected ? color : color }}
              />
              <span className="text-sm font-semibold whitespace-nowrap">{category.name}</span>
            </button>
          );
        })}
    </div>
  );
}
