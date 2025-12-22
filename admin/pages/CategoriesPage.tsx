import React, { useContext } from 'react';
import { AppContext } from '../App';
import { SimpleCardEditor } from '../components/SimpleCardEditor';
import { Printer } from 'lucide-react';
import { Category } from '../types';
import { CategoryIcon, CATEGORY_ICON_OPTIONS } from '../lib/categoryIcons';
import { CATEGORY_COLOR_OPTIONS } from '../lib/categoryColors';

export const CategoriesPage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { categories, addCategory, updateCategory, deleteCategory, printers, categoriesLoading, categoriesSaving } = context;

  const renderCategoryCard = (category: Category) => (
    <div className="flex items-center gap-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border border-primary-200"
        style={{ background: category.color ? `${category.color}1a` : undefined, borderColor: category.color || undefined }}
      >
        <CategoryIcon name={category.icon} className="text-primary-600" size={28} style={{ color: category.color || undefined }} />
      </div>
      <div>
        <h3 className="font-bold text-lg text-slate-800">{category.name}</h3>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <Printer size={12} className={category.printerId ? 'text-slate-400' : 'text-red-500'} />
          {category.printerId
            ? `${printers.find(p => p.id === category.printerId)?.name || category.printerId}`
            : <span className="text-red-600 font-semibold">Kein Drucker (Standard)</span>
          }
        </p>
        <div className={`text-xs mt-2 inline-block px-2 py-0.5 rounded-full font-medium ${category.enabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {category.enabled ? 'Aktiv' : 'Deaktiviert'}
        </div>
      </div>
    </div>
  );

  return (
    <SimpleCardEditor<Category>
      title="Kategorien"
      description="Icons und Farben erscheinen in der Kasse. Ein Drucker kann je Kategorie gesetzt werden."
      isLoading={categoriesLoading}
      isSaving={categoriesSaving}
      data={categories}
      gridClassName='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
      renderCard={renderCategoryCard}
      onAdd={(item) => addCategory(item)}
      onEdit={(item) => updateCategory(item)}
      onDelete={(id) => deleteCategory(id)}
      dialogHint="Icon und Farbe werden in der Kasse angezeigt. Drucker ist optional."
      fields={[
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'icon', label: 'Icon', type: 'icon', options: CATEGORY_ICON_OPTIONS.map(option => ({ label: option.label, value: option.value, icon: <CategoryIcon name={option.value} size={22} /> })) },
        { key: 'color', label: 'Farbe', type: 'color', options: CATEGORY_COLOR_OPTIONS, optional: true },
        { key: 'printerId', label: 'Kategorie-Drucker', type: 'select', options: printers.map(p => ({ label: p.name, value: p.id })), optional: true },
        { key: 'enabled', label: 'Aktiv', type: 'boolean' }
      ]}
    />
  );
};
