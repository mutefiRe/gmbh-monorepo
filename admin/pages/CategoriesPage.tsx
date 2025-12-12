import React, { useContext } from 'react';
import { AppContext } from '../App';
import { SimpleCardEditor } from '../components/SimpleCardEditor';
import { Layers } from 'lucide-react';
import { Category } from '../types';

export const CategoriesPage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { categories, addCategory, updateCategory, deleteCategory, printers } = context;

  const renderCategoryCard = (category: Category) => (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-3xl shadow-sm border border-blue-200">
        {category.icon || <Layers className="text-blue-300" />}
      </div>
      <div>
        <h3 className="font-bold text-lg text-slate-800">{category.name}</h3>
        <p className="text-xs text-slate-500 mt-1">
            {category.printer ? 
                `🖨️ ${printers.find(p => p.systemName === category.printer)?.name || category.printer}` 
                : 'Kein Drucker'
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
      data={categories}
      renderCard={renderCategoryCard}
      onAdd={(item) => addCategory(item)}
      onEdit={(item) => updateCategory(item)}
      onDelete={(id) => deleteCategory(id)}
      fields={[
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'icon', label: 'Icon', type: 'emoji' },
        { key: 'printer', label: 'Standard-Drucker', type: 'select', options: printers.map(p => ({ label: p.name, value: p.systemName })) },
        { key: 'enabled', label: 'Aktiv', type: 'boolean' }
      ]}
    />
  );
};