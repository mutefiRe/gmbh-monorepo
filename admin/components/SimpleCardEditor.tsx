import React, { useState, useEffect } from 'react';
import { Dialog } from './Dialog';
import { Edit2, Plus, Trash2, X, Check } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PrimaryButton } from './PrimaryButton';

interface SimpleCardEditorProps<T> {
  data: T[];
  title: string;
  renderCard: (item: T) => React.ReactNode;
  onAdd: (item: Partial<T>) => void;
  onEdit: (item: T) => void;
  onDelete: (id: any) => void;
  fields: { key: keyof T; label: string; type: 'text' | 'number' | 'boolean' | 'select' | 'emoji' | 'password'; options?: { label: string; value: any, }[], optional?: boolean }[];
  customActions?: React.ReactNode;
  gridClassName?: string; // Allows customizing the grid layout
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
  customActions,
  gridClassName
}: SimpleCardEditorProps<T>) => {
  const [editingItem, setEditingItem] = useState<Partial<T> | null>(null);
  const params = useParams();
  const navigate = useNavigate();
  const isModalOpen = editingItem !== null;

  useEffect(() => {
    let item: Partial<T> | null = null;
    if (params.id === 'new') {
      item = {} as Partial<T>;
    } else if (params.id) {
      item = data.find(d => String(d.id) === params.id) || null;
    }
    setEditingItem(item);
  }, [params.id, data]);

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


  const closeModal = () => {
    navigate('..', { relative: 'path' });
    setEditingItem(null);
  };

  const handleFieldChange = (key: keyof T, value: any) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [key]: value });
    }
  };

  const submitButtonDisabled = () => {
    if (!editingItem) return true;
    for (const field of fields) {
      if (!field.optional && (editingItem[field.key] === undefined || editingItem[field.key] === null || editingItem[field.key] === '')) {
        return true;
      }
    }
    return false;
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <div className="flex items-center gap-3">
          {customActions}
          <Link
            to={'new'}
            component="button"
            className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-sm font-semibold active:scale-95"
          >
            <Plus size={20} />
            Hinzufügen
          </Link>
        </div>
      </div>

      <div className={gridClassName || "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}>
        {data.map((item) => (
          <div key={item.id} className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <Link
                to={`${String(item.id)}`}
                component="button"
                className="p-4 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg hover:bg-primary-100 hover:text-primary hover:border-primary-200 transition-colors active:scale-95"
                title="Bearbeiten"
              >
                <Edit2 size={18} />
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Wirklich löschen?')) onDelete(item.id);
                }}
                className="p-4 bg-slate-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors active:scale-95"
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

      {
        isModalOpen && (
          <Dialog
            open={isModalOpen}
            onClose={closeModal}
            title={
              <h3 className="text-lg font-bold text-slate-800">
                {editingItem && 'id' in editingItem ? 'Bearbeiten' : 'Neu erstellen'}
              </h3>
            }
            actions={
              <>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Abbrechen
                </button>
                <PrimaryButton
                  disabled={submitButtonDisabled()}
                  type="submit"
                  form="simple-card-editor-form"
                  icon={<Check size={20} />}
                >
                  Speichern
                </PrimaryButton>
              </>
            }
            className="max-w-lg"
          >
            <form id="simple-card-editor-form" onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {fields.map((field) => {
                let fieldComponent = null;
                switch (field.type) {
                  case 'text':
                    fieldComponent = <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                      value={editingItem?.[field.key] as string || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={`${field.label} eingeben`}
                    />;
                    break;
                  case 'number':
                    fieldComponent = <input
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                      value={editingItem?.[field.key] as number || ''}
                      onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
                      placeholder={`${field.label} eingeben`}
                    />;
                    break;
                  case 'boolean':
                    fieldComponent = <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleFieldChange(field.key, !editingItem?.[field.key])}
                        className={`w-14 h-8 rounded-full transition-colors relative ${editingItem?.[field.key] ? 'bg-green-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-sm ${editingItem?.[field.key] ? 'left-7' : 'left-1'}`} />
                      </button>
                      <span className="font-medium text-slate-600">{editingItem?.[field.key] ? 'Aktiv' : 'Inaktiv'}</span>
                    </div>;
                    break;
                  case 'select':
                    fieldComponent = <select
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                      value={editingItem?.[field.key] as string}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    >
                      <option value="">Bitte wählen</option>
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>;
                    break;
                  case 'emoji':
                    fieldComponent = <div className="space-y-3">
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
                            className={`w-8 h-8 flex items-center justify-center text-xl rounded hover:bg-white hover:shadow-sm transition-all ${editingItem?.[field.key] === emoji ? 'bg-primary-100 ring-2 ring-blue-500' : ''}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>;
                    break;
                  case 'password':
                    fieldComponent = <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                      value={editingItem?.[field.key] as string || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={`${field.label} eingeben`}
                    />;
                    break;
                  default:
                    console.warn(`Unsupported field type: ${field.type}`);
                    return null;
                }

                return (
                  <div key={field.key as string}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {field.label}
                    </label>
                    {fieldComponent}
                  </div>
                )
              })}
            </form>
          </Dialog>
        )
      }
    </div >
  );
};