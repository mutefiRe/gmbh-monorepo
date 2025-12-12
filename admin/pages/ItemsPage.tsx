import React, { useContext } from 'react';
import { AppContext } from '../App';
import { TableCardEditor } from '../components/TableCardEditor';

export const ItemsPage: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return <div>Laden...</div>;
  const { items, updateItem, addItem, deleteItem, categories, units, isLoading } = context;

  const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name, 'de'));
  return (
    <TableCardEditor
      title="Speisekarte"
      data={sortedItems}
      categories={categories}
      columns={[
        { key: 'name', label: 'Name', sortable: true },
        { key: 'price', label: 'Preis', render: item => `${item.price} €`, sortable: true },
        { key: 'amount', label: 'Menge', sortable: true },
        { key: 'unitId', label: 'Einheit', render: item => units.find(u => u.id === item.unitId)?.name || '-', sortable: true, sortFn: (a, b, dir) => {
          const aUnit = units.find(u => u.id === a.unitId)?.name || '';
          const bUnit = units.find(u => u.id === b.unitId)?.name || '';
          return dir === 'asc' ? aUnit.localeCompare(bUnit, 'de') : bUnit.localeCompare(aUnit, 'de');
        } },
        { key: 'tax', label: 'Steuer', render: item => `${item.tax} %`, sortable: true },
        { key: 'enabled', label: 'Status', render: item => item.enabled ? 'Aktiv' : 'Inaktiv', sortable: true, sortFn: (a, b, dir) => {
          return dir === 'asc' ? Number(b.enabled) - Number(a.enabled) : Number(a.enabled) - Number(b.enabled);
        } },
      ]}
      onAdd={addItem}
      onEdit={updateItem}
      onDelete={deleteItem}
      fields={[
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'price', label: 'Preis', type: 'number' },
        { key: 'amount', label: 'Menge', type: 'number' },
        { key: 'categoryId', label: 'Kategorie', type: 'select', options: categories.map(c => ({ label: c.name, value: c.id })) },
        { key: 'unitId', label: 'Einheit', type: 'select', options: units.map(u => ({ label: u.name, value: u.id })) },
        { key: 'tax', label: 'Steuer', type: 'number' },
        { key: 'enabled', label: 'Aktiv', type: 'boolean' },
      ]}
    />
  );
};