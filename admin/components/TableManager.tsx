import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { Plus, Trash2, X, CheckSquare, Square, MapPin } from 'lucide-react';
import { Area, Table } from '../types';
import { PrimaryButton } from './PrimaryButton';

interface TableManagerProps {
  area: Area;
  tables: Table[];
  onClose: () => void;
  createTable: (table: Partial<Table>) => void;
  updateTable: (table: Table) => void;
  deleteTable: (id: string) => void;
}

export const TableManager: React.FC<TableManagerProps> = ({
  area,
  tables,
  onClose,
  createTable,
  updateTable,
  deleteTable,
}) => {
  const [bulkAddConfig, setBulkAddConfig] = useState({ prefix: '', start: 1, count: 5 });
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);

  const areaTables = tables.filter(t => t.areaId === area.id);
  const activeAreaTables = areaTables;
  const areAllActiveSelected = activeAreaTables.length > 0 && activeAreaTables.every(t => selectedTableIds.includes(t.id!));

  const handleBulkAdd = async () => {
    for (let i = 0; i < bulkAddConfig.count; i++) {
      await createTable({
        areaId: area.id,
        name: `${bulkAddConfig.prefix} ${bulkAddConfig.start + i}`,
        enabled: true,
        x: 0,
        y: 0,
        custom: false,
      });
    }
    setBulkAddConfig(prev => ({ ...prev, start: prev.start + prev.count }));
  };

  const handleBulkDelete = async () => {
    if (confirm(`${selectedTableIds.length} Tische löschen?`)) {
      for (const id of selectedTableIds) {
        await deleteTable(id);
      }
      setSelectedTableIds([]);
    }
  };

  const toggleTableSelection = (id: string) => {
    if (selectedTableIds.includes(id)) {
      setSelectedTableIds(selectedTableIds.filter(tid => tid !== id));
    } else {
      setSelectedTableIds([...selectedTableIds, id]);
    }
  };

  const toggleAllTables = () => {
    const areaTableIds = activeAreaTables.map(t => t.id!);
    const allSelected = areaTableIds.every(id => selectedTableIds.includes(id));
    if (allSelected) {
      setSelectedTableIds(selectedTableIds.filter(id => !areaTableIds.includes(id)));
    } else {
      const newIds = [...selectedTableIds];
      areaTableIds.forEach(id => {
        if (!newIds.includes(id)) newIds.push(id);
      });
      setSelectedTableIds(newIds);
    }
  };

  return (
    <Dialog
      open={!!area}
      onClose={onClose}
      title={
        <>
          <h3 className="text-lg font-bold text-slate-800">Tische verwalten</h3>
          <p className="text-sm text-slate-500">Bereich: <span className="font-semibold text-primary">{area.name}</span></p>
        </>
      }
      actions={
        <button
          onClick={onClose}
          className="px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors font-bold active:scale-95 shadow-lg shadow-slate-200"
        >
          Fertig
        </button>
      }
      className="max-w-4xl"
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Panel: Bulk Add */}
        <div className="w-full md:w-1/3 bg-slate-50 p-6 border-r border-slate-200 overflow-y-auto">
          <h4 className="font-semibold text-slate-700 mb-6 flex items-center gap-2">
            <Plus size={20} /> Massen hinzufügen
          </h4>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Präfix</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-base bg-white text-slate-900"
                value={bulkAddConfig.prefix}
                onChange={e => setBulkAddConfig({ ...bulkAddConfig, prefix: e.target.value })}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Start Nr.</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-base bg-white text-slate-900"
                  value={bulkAddConfig.start}
                  onChange={e => setBulkAddConfig({ ...bulkAddConfig, start: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Anzahl</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-base bg-white text-slate-900"
                  value={bulkAddConfig.count}
                  onChange={e => setBulkAddConfig({ ...bulkAddConfig, count: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="bg-primary-100 text-primary-800 p-4 rounded-xl text-sm border border-primary-200">
              Vorschau: <span className="font-bold">{bulkAddConfig.prefix} {bulkAddConfig.start}</span> ... <span className="font-bold">{bulkAddConfig.prefix} {bulkAddConfig.start + bulkAddConfig.count - 1}</span>
            </div>

            <PrimaryButton
              onClick={handleBulkAdd}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-md shadow-blue-200 active:scale-95"
            >
              {bulkAddConfig.count} Tische generieren
            </PrimaryButton>
          </div>
        </div>

        {/* Right Panel: Existing Tables List */}
        <div className="flex-1 flex flex-col min-h-0 bg-white">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shadow-sm z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleAllTables}
                className="text-slate-400 hover:text-primary transition-colors p-1"
                title="Alle auswählen"
              >
                {areAllActiveSelected
                  ? <CheckSquare size={24} className="text-primary" />
                  : <Square size={24} />
                }
              </button>
              <span className="font-bold text-slate-700">{activeAreaTables.length} Tische vorhanden</span>
            </div>

            {selectedTableIds.length > 0 && (
              <>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-bold active:scale-95"
                >
                  <Trash2 size={18} />
                  Löschen ({selectedTableIds.length})
                </button>
                <button
                  onClick={async () => {
                    const toEnable = activeAreaTables.some(t => t.enabled && selectedTableIds.includes(t.id!));
                    for (const id of selectedTableIds) {
                      const table = activeAreaTables.find(t => t.id === id);
                      if (table) {
                        await updateTable({ ...table, enabled: toEnable ? false : true });
                      }
                    }
                    setSelectedTableIds([]);
                  }}
                  className="flex items-center gap-2 text-yellow-700 bg-yellow-100 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-bold active:scale-95 ml-2"
                >
                  <X size={18} />
                  {activeAreaTables.some(t => t.enabled && selectedTableIds.includes(t.id!)) ? 'Deaktivieren' : 'Aktivieren'}
                </button>
              </>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {activeAreaTables.map(table => (
                <div
                  key={table.id}
                  onClick={() => toggleTableSelection(table.id!)}
                  className={
                    `cursor-pointer p-4 rounded-xl border-2 transition-all select-none flex items-center justify-between active:scale-95
                    ${!table.enabled ? 'bg-orange-100 border-orange-400 text-orange-700' : selectedTableIds.includes(table.id!)
                      ? 'bg-primary-100 border-primary-500 shadow-sm'
                      : 'bg-white border-transparent shadow-sm hover:border-primary-200'}
                    `
                  }
                >
                  <span className={`font-bold text-lg flex items-center gap-2 ${!table.enabled ? 'text-orange-700' : selectedTableIds.includes(table.id!) ? 'text-blue-700' : 'text-slate-600'}`}>
                    {area.short}{table.name}
                  </span>
                  {selectedTableIds.includes(table.id!) && <CheckSquare size={20} className="text-primary-500" />}
                </div>
              ))}
              {activeAreaTables.length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
                  <MapPin size={48} className="mb-4 text-slate-200" />
                  <p className="text-lg font-medium">Noch keine Tische in diesem Bereich.</p>
                  <p className="text-sm">Nutzen Sie das Menü links, um welche hinzuzufügen.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
