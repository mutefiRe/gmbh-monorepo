import React, { useState, useEffect } from 'react';
import { Item, Category, Unit } from '../types';
import { Check, X, Search, Plus, Trash2, Loader2 } from 'lucide-react';

interface SmartSheetProps {
  items: Item[];
  categories: Category[];
  units: Unit[];
  onSaveItem: (item: Item) => void;
  onAddItem: (item: Partial<Item>) => void;
  onDeleteItem: (id: number) => void;
  isLoading?: boolean;
}

export const SmartSheet: React.FC<SmartSheetProps> = ({
  items, categories, units, onSaveItem, onAddItem, onDeleteItem, isLoading
}) => {
  const [filter, setFilter] = useState('');
  const [localItems, setLocalItems] = useState<Item[]>(items);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBuffer, setEditBuffer] = useState<Partial<Item>>({});
  const [newRowId, setNewRowId] = useState(-1);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  // Sort by createdAt (oldest first), fallback to id if missing
  const sortedItems = [...localItems].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return (a.id > b.id ? 1 : -1);
  });
  const filteredItems = sortedItems.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));

  const startEdit = (item: Item) => {
    setEditingId(item.id);
    setEditBuffer({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditBuffer({});
  };

  const handleEditChange = (field: keyof Item, value: any) => {
    setEditBuffer(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!editBuffer) return;
    if (editingId && editingId < 0) {
      // New unsaved row
      onAddItem({ ...editBuffer, id: undefined });
      setLocalItems(prev => prev.filter(it => it.id !== editingId));
    } else {
      onSaveItem(editBuffer as Item);
    }
    setEditingId(null);
    setEditBuffer({});
  };

  const addNewItem = () => {
    if (localItems.some(item => typeof item.id === 'number' && item.id < 0)) return;
    const tempId = newRowId;
    setNewRowId(id => id - 1);
    const newItem: Item = {
      id: tempId,
      name: '',
      price: 0,
      tax: 0.10,
      categoryId: categories[0]?.id || '',
      enabled: true,
      unitId: units[0]?.id || '',
      amount: 1,
    } as Item;
    setLocalItems(prev => [...prev, newItem]);
    setEditingId(tempId);
    setEditBuffer({ ...newItem });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center backdrop-blur-sm">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}

      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Artikel suchen..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <button
          onClick={addNewItem}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-sm active:scale-95"
        >
          <Plus size={18} />
          Hinzufügen
        </button>
      </div>

      {/* Card List */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {filteredItems.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            Keine Artikel gefunden.
          </div>
        )}
        {filteredItems.map(item => (
          <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-lg shadow-sm p-6 flex flex-col gap-4">
            {editingId === item.id ? (
              <>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded border border-slate-200 bg-white"
                      value={editBuffer.name || ''}
                      onChange={e => handleEditChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Preis</label>
                    <input
                      type="number"
                      className="w-full p-2 rounded border border-slate-200 bg-white"
                      value={editBuffer.price || 0}
                      onChange={e => handleEditChange('price', parseFloat(e.target.value))}
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Steuer</label>
                    <input
                      type="number"
                      className="w-full p-2 rounded border border-slate-200 bg-white"
                      value={editBuffer.tax || 0}
                      onChange={e => handleEditChange('tax', parseFloat(e.target.value))}
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Kategorie</label>
                    <select
                      className="w-full p-2 rounded border border-slate-200 bg-white"
                      value={editBuffer.categoryId || ''}
                      onChange={e => handleEditChange('categoryId', e.target.value)}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Menge</label>
                    <input
                      type="number"
                      className="w-full p-2 rounded border border-slate-200 bg-white"
                      value={editBuffer.amount || 1}
                      onChange={e => handleEditChange('amount', parseFloat(e.target.value))}
                      step="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Einheit</label>
                    <select
                      className="w-full p-2 rounded border border-slate-200 bg-white"
                      value={editBuffer.unitId || ''}
                      onChange={e => handleEditChange('unitId', e.target.value)}
                    >
                      {units.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <label className="text-xs font-semibold text-slate-500">Aktiv</label>
                    <input
                      type="checkbox"
                      checked={!!editBuffer.enabled}
                      onChange={e => handleEditChange('enabled', e.target.checked)}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    <Check size={16} /> Speichern
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 bg-slate-200 text-slate-600 px-4 py-2 rounded hover:bg-slate-300 transition-colors"
                  >
                    <X size={16} /> Abbrechen
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 gap-2">
                  <div className="font-bold text-lg text-slate-800 flex-1">{item.name}</div>
                  <div className="text-slate-500">{item.price} €</div>
                  <div className="text-slate-500">{categories.find(c => c.id === item.categoryId)?.name || '-'}</div>
                  <div className="text-slate-500">{item.tax}%</div>
                  <div className="text-slate-500">{item.amount}</div>
                  <div className="text-slate-500">{units.find(u => u.id === item.unitId)?.name || '-'}</div>
                  <div className="text-slate-500">{item.enabled ? 'Aktiv' : 'Inaktiv'}</div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => {
                      if (item.id < 0) {
                        setLocalItems(prev => prev.filter(it => it.id !== item.id));
                      } else {
                        onDeleteItem(item.id);
                      }
                    }}
                    className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={16} /> Löschen
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="p-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-right">
        {items.length} Artikel
      </div>
    </div>
  );
};