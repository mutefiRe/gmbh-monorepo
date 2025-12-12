import React, { useState } from 'react';
import { Edit2, Plus, Trash2, X, Check } from 'lucide-react';
import { useNotification } from './NotificationProvider';

interface TableCardEditorProps<T> {
  data: T[];
  title: string;
  columns: { key: keyof T; label: string; render?: (item: T) => React.ReactNode }[];
  onAdd: (item: Partial<T>) => void;
  onEdit: (item: T) => void;
  onDelete: (id: any) => void;
  fields: { key: keyof T; label: string; type: 'text' | 'number' | 'boolean' | 'select'; options?: { label: string; value: any }[] }[];
  sortable?: boolean;
  sortFn?: (a: T, b: T, direction: 'asc' | 'desc') => number;
}

export function TableCardEditor<T extends { id: any }>({
  data,
  title,
  columns,
  onAdd,
  onEdit,
  onDelete,
  fields
}: TableCardEditorProps<T> & { categories?: { id: any; name: string; icon?: string }[] }) {
  
  // Filter and sorting state
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<T> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: any } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem && 'id' in editingItem && editingItem.id) {
      onEdit(editingItem as T);
    } else if (editingItem) {
      onAdd(editingItem);
    }
    closeModal();
  };

  const openAddModal = () => {
    setEditingItem({});
    setIsModalOpen(true);
  };

  const openEditModal = (item: T) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

        const handleDelete = (id: any) => {
        setConfirmDelete({ id });
      };

      const confirmDeleteAction = () => {
        if (confirmDelete) {
          onDelete(confirmDelete.id);
          setConfirmDelete(null);
        }
      };

  const handleFieldChange = (key: keyof T, value: any) => {

    if (editingItem) {
      setEditingItem({ ...editingItem, [key]: value });
  const [loading, setLoading] = useState(false);
  const notification = useNotification();
    }
  };

  // Filtering
  let filtered = data;
  if (filter) {
    filtered = filtered.filter(item => (item.name || '').toLowerCase().includes(filter.toLowerCase()));
  }

  // Sorting
  let sorted = filtered;
  if (sortKey) {
    const col = columns.find(c => c.key === sortKey);
    if (col?.sortable) {
      sorted = [...filtered].sort((a, b) => {
        if (col.sortFn) return col.sortFn(a, b, sortDir);
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === 'number' && typeof bVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        return sortDir === 'asc'
          ? String(aVal || '').localeCompare(String(bVal || ''), 'de')
          : String(bVal || '').localeCompare(String(aVal || ''), 'de');
      });
    }
  }

  // Grouping by category if categories prop is provided
  let grouped: { group: string; icon?: string; items: T[] }[] = [];
  if (Array.isArray((TableCardEditor as any).categories) || Array.isArray((arguments[0] as any).categories)) {
    // fallback for TS, real prop is categories
    const cats = (arguments[0] as any).categories || [];
    grouped = cats.map((cat: any) => ({
      group: cat.name,
      icon: cat.icon,
      items: sorted.filter((item: any) => item.categoryId === cat.id)
    }));
    // Add uncategorized
    const uncategorized = sorted.filter((item: any) => !item.categoryId || !cats.find((c: any) => c.id === item.categoryId));
    if (uncategorized.length > 0) grouped.push({ group: 'Ohne Kategorie', icon: '🗂️', items: uncategorized });
  } else {
    grouped = [{ group: '', items: sorted }];
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-semibold active:scale-95"
        >
          <Plus size={20} />
          Hinzufügen
        </button>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          placeholder="Nach Name filtern..."
          className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 w-64"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      {grouped.map((group, idx) => (
        <div key={group.group + idx} className="overflow-x-auto">
          {group.group && (
            <div className="flex items-center gap-3 mb-2 mt-6">
              <span className="text-2xl">{group.icon || '🗂️'}</span>
              <span className="font-bold text-lg text-slate-700">{group.group}</span>
            </div>
          )}
          <table className="min-w-full bg-white border border-slate-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-slate-100">
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key as string}
                    className={`px-2 py-2 md:px-4 text-left text-xs font-semibold text-slate-500 uppercase ${col.sortable ? 'cursor-pointer select-none hover:text-blue-600' : ''}`}
                    onClick={() => {
                      if (col.sortable) {
                        if (sortKey === col.key) {
                          setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortKey(col.key);
                          setSortDir('asc');
                        }
                      }
                    }}
                  >
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span className="ml-1 inline-block align-middle">{sortDir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </th>
                ))}
                <th className="px-2 py-2 md:px-4 text-center text-xs font-semibold text-slate-500 uppercase">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {group.items.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-slate-400 italic text-center py-4">Keine Einträge vorhanden.</td>
                </tr>
              ) : (
                group.items.map(item => (
                  <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                    {columns.map(col => (
                      <td key={col.key as string} className="px-2 py-2 md:px-4 whitespace-nowrap md:whitespace-normal">
                        {col.render ? col.render(item) : (item[col.key] as any)}
                      </td>
                    ))}
                    <td className="px-2 py-2 md:px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        title="Bearbeiten"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg ml-2"
                        title="Löschen"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                        {/* Delete Confirm Dialog */}
                        {confirmDelete && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                            <div className="bg-white rounded-xl shadow-xl p-6 w-80 max-w-full flex flex-col items-center animate-zoomIn">
                              <div className="mb-4 text-lg text-center text-slate-800 font-semibold">Wirklich löschen?</div>
                              <div className="flex gap-4 mt-2">
                                <button
                                  className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 text-slate-700"
                                  onClick={() => setConfirmDelete(null)}
                                >Abbrechen</button>
                                <button
                                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                                  onClick={confirmDeleteAction}
                                >Löschen</button>
                              </div>
                            </div>
                          </div>
                        )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ))}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-zoomIn">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">
                {editingItem && 'id' in editingItem ? 'Bearbeiten' : 'Neu erstellen'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {fields.map((field) => (
                <div key={field.key as string}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {field.label}
                  </label>
                  {field.type === 'boolean' ? (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleFieldChange(field.key, !editingItem?.[field.key])}
                        className={`w-14 h-8 rounded-full transition-colors relative ${editingItem?.[field.key] ? 'bg-green-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-sm ${editingItem?.[field.key] ? 'left-7' : 'left-1'}`} />
                      </button>
                      <span className="font-medium text-slate-600">{editingItem?.[field.key] ? 'Aktiv' : 'Inaktiv'}</span>
                    </div>
                  ) : field.type === 'select' ? (
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                      value={editingItem?.[field.key] as string}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    >
                      <option value="">Bitte wählen</option>
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                      value={editingItem?.[field.key] as string || ''}
                      onChange={(e) => handleFieldChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                      placeholder={`${field.label} eingeben`}
                    />
                  )}
                </div>
              ))}
              <div className="pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-semibold shadow-md shadow-blue-200 flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <Check size={20} />
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
