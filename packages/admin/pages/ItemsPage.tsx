import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { TableCardEditor } from '../components/TableCardEditor';
import { LoadingNotice } from '../components/LoadingNotice';
import { Plus } from 'lucide-react';

export const ItemsPage: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return <div>Laden...</div>;
  const { items, updateItem, addItem, deleteItem, categories, units, itemsLoading, itemsSaving, categoriesLoading, unitsLoading } = context;

  const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name, 'de'));
  const isBusy = itemsLoading || itemsSaving || categoriesLoading || unitsLoading;
  const addButton = (
    <Link
      to={'/items/new'}
      component="button"
      className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-colors shadow-sm font-semibold active:scale-95 ${isBusy
        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
        : 'bg-primary-600 text-white hover:bg-primary-700'
        }`}
      onClick={(event) => {
        if (isBusy) {
          event.preventDefault();
        }
      }}
    >
      <Plus size={20} />
      {itemsSaving ? 'Speichert...' : 'Hinzufügen'}
    </Link>
  );

  return (
    <>
      <LoadingNotice active={itemsLoading || categoriesLoading || unitsLoading} />
      <TableCardEditor
        title="Speisekarte"
        description="Artikel, Preise und Einheiten steuern die Anzeige in der Kasse."
        isLoading={itemsLoading || categoriesLoading || unitsLoading}
        isSaving={itemsSaving}
        data={sortedItems}
        categories={categories}
        headerActions={addButton}
        columns={[
          {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: item => (
              <div>
                <div className="font-semibold text-slate-800">{item.name}</div>
                <div className="text-xs text-slate-500">
                  {categories.find(c => c.id === item.categoryId)?.name || '-'}
                </div>
              </div>
            )
          },
          { key: 'price', label: 'Preis', render: item => `${item.price} €`, sortable: true },
          { key: 'amount', label: 'Menge', sortable: true },
          {
            key: 'unitId', label: 'Einheit', render: item => units.find(u => u.id === item.unitId)?.name || '-', sortable: true, sortFn: (a, b, dir) => {
              const aUnit = units.find(u => u.id === a.unitId)?.name || '';
              const bUnit = units.find(u => u.id === b.unitId)?.name || '';
              return dir === 'asc' ? aUnit.localeCompare(bUnit, 'de') : bUnit.localeCompare(aUnit, 'de');
            }
          },
          {
            key: 'enabled', label: 'Status', render: item => item.enabled ? 'Aktiv' : 'Inaktiv', sortable: true, sortFn: (a, b, dir) => {
              return dir === 'asc' ? Number(b.enabled) - Number(a.enabled) : Number(a.enabled) - Number(b.enabled);
            }
          },
        ]}
        onAdd={addItem}
        onEdit={updateItem}
        onDelete={deleteItem}
        dialogHint="Preis in EUR. Menge und Einheit werden in der Kasse angezeigt."
        fields={[
          { key: 'name', label: 'Name', type: 'text', row: 0, width: 'full' },
          { key: 'categoryId', label: 'Kategorie', type: 'select', options: categories.map(c => ({ label: c.name, value: c.id })), row: 1, width: 'full' },
          { key: 'price', label: 'Preis', type: 'number', row: 2, width: 'full' },
          { key: 'amount', label: 'Menge', type: 'number', row: 3, width: 'half' },
          { key: 'unitId', label: 'Einheit', type: 'select', options: units.map(u => ({ label: u.name, value: u.id })), row: 3, width: 'half' },
          { key: 'enabled', label: 'Aktiv', type: 'boolean', row: 4, width: 'full', inline: true },
        ]}
      />
    </>
  );
};
