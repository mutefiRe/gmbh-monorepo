import React, { useState } from 'react';
import { Edit2, Plus, Trash2, X, Check } from 'lucide-react';

interface SimpleCardEditorProps<T> {
  data: T[];
  title: string;
  renderCard: (item: T) => React.ReactNode;
  onAdd: (item: Partial<T>) => void;
  onEdit: (item: T) => void;
  onDelete: (id: any) => void;
  fields: { key: keyof T; label: string; type: 'text' | 'number' | 'boolean' | 'select' | 'emoji'; options?: { label: string; value: any }[] }[];
  customActions?: React.ReactNode;
}

const EMOJI_OPTIONS = [
  '🍕', '🍔', '🍟', '🌭', '🥪', '🌮', '🌯', '🥗', 
  '🥘', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🍤', 
  '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🥧', 
  '☕', '🍵', '🥤', '🧋', '🍺', '🍷', '🥂', '🥃',
  '🥩', '🍗', '🍖', '🧀', '🥨', '🥐', '🥖', '🍎',
  '🍽️', '🍴', '🥄', '🔪', '🧂', '🌶️', '🍋', '🥦'
];

export const SimpleCardEditor = <T extends { id: any; name?: string }>({ 
  data, 
  title, 
  renderCard, 
  onAdd, 
  onEdit, 
  onDelete, 
  fields,
  customActions
}: SimpleCardEditorProps<T>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<T> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem && 'id' in editingItem && editingItem.id) {
        // @ts-ignore - We know it's a T
      onEdit(editingItem as T);
    } else if (editingItem) {
      onAdd(editingItem);
    }
    closeModal();
  };

  const openAddModal = () => {
    setEditingItem({}); // Empty object for new item
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

  const handleFieldChange = (key: keyof T, value: any) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [key]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <div className="flex items-center gap-3">
          {customActions}
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-semibold active:scale-95"
          >
            <Plus size={20} />
            Hinzufügen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((item) => (
          <div key={item.id} className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
                className="p-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors active:scale-95"
                title="Bearbeiten"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    if(confirm('Wirklich löschen?')) onDelete(item.id); 
                }}
                className="p-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors active:scale-95"
                title="Löschen"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="flex-1">
                {renderCard(item)}
            </div>
          </div>
        ))}
      </div>

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
                  ) : field.type === 'emoji' ? (
                     <div className="space-y-3">
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 text-2xl text-center"
                          value={editingItem?.[field.key] as string || ''}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          placeholder="Emoji hier einfügen"
                        />
                        <div className="grid grid-cols-8 gap-2 p-2 border border-slate-200 rounded-xl bg-slate-50 h-32 overflow-y-auto">
                           {EMOJI_OPTIONS.map(emoji => (
                             <button
                               key={emoji}
                               type="button"
                               onClick={() => handleFieldChange(field.key, emoji)}
                               className={`w-8 h-8 flex items-center justify-center text-xl rounded hover:bg-white hover:shadow-sm transition-all ${editingItem?.[field.key] === emoji ? 'bg-blue-100 ring-2 ring-blue-500' : ''}`}
                             >
                               {emoji}
                             </button>
                           ))}
                        </div>
                     </div>
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
};