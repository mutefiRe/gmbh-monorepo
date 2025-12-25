import React, { useState, useEffect } from 'react';
import { Dialog } from './Dialog';
import { Edit2, Trash2, X, Check } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PrimaryButton } from './PrimaryButton';

interface SimpleCardEditorProps<T> {
  data: T[];
  title: string;
  description?: React.ReactNode;
  isLoading?: boolean;
  isSaving?: boolean;
  newDefaults?: Partial<T>;
  renderCard: (item: T) => React.ReactNode;
  onAdd: (item: Partial<T>) => void;
  onEdit: (item: T) => void;
  onDelete: (id: any) => void;
  fields: { key: keyof T; label: string; type: 'text' | 'number' | 'boolean' | 'select' | 'emoji' | 'icon' | 'color' | 'password'; options?: { label: string; value: any; icon?: React.ReactNode }[], optional?: boolean; readOnly?: boolean }[];
  headerActions?: React.ReactNode;
  gridClassName?: string; // Allows customizing the grid layout
  dialogHint?: React.ReactNode;
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
  description,
  isLoading = false,
  isSaving = false,
  renderCard,
  onAdd,
  onEdit,
  onDelete,
  fields,
  newDefaults,
  headerActions,
  gridClassName,
  dialogHint
}: SimpleCardEditorProps<T>) => {
  const [editingItem, setEditingItem] = useState<Partial<T> | null>(null);
  const params = useParams();
  const navigate = useNavigate();
  const isModalOpen = editingItem !== null;

  useEffect(() => {
    let item: Partial<T> | null = null;
    if (params.id === 'new') {
      item = { ...(newDefaults || {}) } as Partial<T>;
      fields
        .filter((field) => field.type === 'boolean' && field.key === 'enabled')
        .forEach((field) => {
          if (item && item[field.key] === undefined) {
            item[field.key] = true as T[keyof T];
          }
        });
    } else if (params.id) {
      item = data.find(d => String(d.id) === params.id) || null;
    }
    setEditingItem(item);
  }, [params.id, data]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) {
      return;
    }

    const payload = { ...editingItem } as Partial<T>;
    fields
      .filter((field) => field.type === 'number')
      .forEach((field) => {
        const rawValue = payload[field.key];
        if (rawValue === '' || rawValue === null || rawValue === undefined) {
          delete payload[field.key];
          return;
        }
        if (typeof rawValue === 'string') {
          const normalized = rawValue.replace(',', '.');
          const parsed = Number(normalized);
          if (Number.isNaN(parsed)) {
            delete payload[field.key];
          } else {
            payload[field.key] = parsed as any;
          }
        }
      });
    fields
      .filter((field) => field.type === 'select')
      .forEach((field) => {
        const rawValue = payload[field.key];
        if (field.optional && (rawValue === '' || rawValue === undefined)) {
          payload[field.key] = null as any;
        }
      });

    if ('id' in payload && payload.id) {
      // @ts-ignore - We know it's a T
      onEdit(payload as T);
    } else {
      onAdd(payload);
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
    if (isSaving) return true;
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
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          {description && (
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {headerActions}
        </div>
      </div>

      <div className={gridClassName || "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}>
        {isLoading && data.length === 0 && (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-400">
            Daten werden geladen...
          </div>
        )}
        {data.map((item) => (
          <div key={item.id} className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <Link
                to={`${String(item.id)}`}
                component="button"
                className={`p-4 bg-slate-50 border rounded-lg transition-colors active:scale-95 ${isSaving
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-200 text-slate-600 hover:bg-primary-100 hover:text-primary hover:border-primary-200'
                  }`}
                onClick={(event) => {
                  if (isSaving) {
                    event.preventDefault();
                  }
                }}
                title="Bearbeiten"
              >
                <Edit2 size={18} />
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Wirklich löschen?')) onDelete(item.id);
                }}
                disabled={isSaving}
                className={`p-4 bg-slate-50 border rounded-lg transition-colors active:scale-95 ${isSaving
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                  }`}
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
                  loading={isSaving}
                >
                  Speichern
                </PrimaryButton>
              </>
            }
            className="max-w-lg"
          >
            <form id="simple-card-editor-form" onSubmit={handleSave} className="p-6 space-y-4">
              {dialogHint && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {dialogHint}
                </div>
              )}
              {fields.map((field) => {
                let fieldComponent = null;
                switch (field.type) {
                  case 'text':
                    fieldComponent = <input
                      type="text"
                      className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 ${field.readOnly ? 'bg-slate-100 text-slate-500' : ''}`}
                      value={editingItem?.[field.key] as string || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      readOnly={field.readOnly}
                      placeholder={`${field.label} eingeben`}
                    />;
                    break;
                  case 'number':
                    fieldComponent = <input
                      type="text"
                      inputMode="decimal"
                      className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 ${field.readOnly ? 'bg-slate-100 text-slate-500' : ''}`}
                      value={(editingItem?.[field.key] as number | string | undefined) ?? ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      readOnly={field.readOnly}
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
                      value={editingItem?.[field.key] as string}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      disabled={field.readOnly}
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
                  case 'icon':
                    fieldComponent = (
                      <div className="grid grid-cols-4 gap-3">
                        {field.options?.map(option => {
                          const isSelected = editingItem?.[field.key] === option.value;
                          const editingId = (editingItem as any)?.id;
                          const normalizedOption = String(option.value || '').toLowerCase();
                          const isUsed = data.some((item) => {
                            if ((item as any).id === editingId) return false;
                            const value = (item as any)[field.key];
                            return value && String(value).toLowerCase() === normalizedOption;
                          });
                          const isDisabled = isUsed && !isSelected;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                if (isDisabled) return;
                                handleFieldChange(field.key, option.value);
                              }}
                              className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${isSelected
                                ? 'border-primary-300 bg-primary-50 text-primary-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                } ${isDisabled ? 'opacity-40 cursor-not-allowed hover:bg-white pointer-events-none' : ''}`}
                              aria-label={option.label}
                              title={option.label}
                              disabled={isDisabled}
                            >
                              <span className="text-primary-600">{option.icon}</span>
                            </button>
                          );
                        })}
                      </div>
                    );
                    break;
                  case 'color':
                    fieldComponent = (
                      <div className="space-y-3">
                        {field.options && field.options.length > 0 && (
                          <div className="grid grid-cols-4 gap-2">
                            {field.options.map((option) => {
                              const isSelected = editingItem?.[field.key] === option.value;
                              const editingId = (editingItem as any)?.id;
                              const normalizedOption = String(option.value || '').toLowerCase();
                              const isUsed = data.some((item) => {
                                if ((item as any).id === editingId) return false;
                                const value = (item as any)[field.key];
                                return value && String(value).toLowerCase() === normalizedOption;
                              });
                              const isDisabled = isUsed && !isSelected;
                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => {
                                    if (isDisabled) return;
                                    handleFieldChange(field.key, option.value);
                                  }}
                                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${isSelected
                                    ? 'border-primary-300 bg-primary-50 text-primary-700'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                    } ${isDisabled ? 'opacity-40 cursor-not-allowed hover:bg-white pointer-events-none' : ''}`}
                                  aria-label={option.label}
                                  title={option.label}
                                  disabled={isDisabled}
                                >
                                  <span className="h-4 w-4 rounded-full border border-slate-200" style={{ background: String(option.value) }} />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
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
