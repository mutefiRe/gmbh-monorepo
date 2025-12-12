import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { SimpleCardEditor } from '../components/SimpleCardEditor';
import { Area, Table } from '../types';
import { MapPin, Settings2, Plus, Trash2, X, CheckSquare, Square } from 'lucide-react';
import { api } from '@/services/api';

export const AreasPage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { areas, addArea, updateArea, deleteArea, tables, createTable, updateTable, deleteTable } = context;

  const [managingArea, setManagingArea] = useState<Area | null>(null);
  const [bulkAddConfig, setBulkAddConfig] = useState({ prefix: 'Tisch', start: 1, count: 1 });
  const [selectedTableIds, setSelectedTableIds] = useState<number[]>([]);

  const openTableManager = (area: Area) => {
    const areaTables = tables.filter(t => t.areaId === area.id);
    let maxNum = 0;
    areaTables.forEach(t => {
      const match = t.name.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxNum) maxNum = num;
      }
    });

    setBulkAddConfig({ prefix: '', start: maxNum + 1, count: 5 });
    setSelectedTableIds([]);
    setManagingArea(area);
  };

  const closeTableManager = () => {
    setManagingArea(null);
  };

  const handleBulkAdd = async () => {
    if (!managingArea) return;

    const newTables: Table[] = [];

    for (let i = 0; i < bulkAddConfig.count; i++) {
      newTables.push({
        areaId: managingArea.id,
        name: `${bulkAddConfig.prefix} ${bulkAddConfig.start + i}`,
        enabled: true,
        x: 0,
        y: 0,
        custom: false
      });
    }

    // Here we are still using the "legacy" setTables because refactoring this to individual API calls 
    // for bulk add would be complex in this scope.
    // The App.tsx handles setTables by updating the Query Cache directly.
    for (const t of newTables) {
      await createTable(t);
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

  const toggleTableSelection = (id: number) => {
    if (selectedTableIds.includes(id)) {
      setSelectedTableIds(selectedTableIds.filter(tid => tid !== id));
    } else {
      setSelectedTableIds([...selectedTableIds, id]);
    }
  };

  const toggleAllTables = () => {
    if (!managingArea) return;
    const areaTables = tables.filter(t => t.areaId === managingArea.id);
    const areaTableIds = areaTables.map(t => t.id);
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
  }

  const renderAreaCard = (area: Area) => {
    const areaTables = tables.filter(t => t.areaId === area.id);
    return (
      <div className="flex flex-col h-full pt-1">
        <div className="flex items-center gap-3 mb-4 pr-24">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl shrink-0">
            <MapPin size={24} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-slate-800 truncate">{area.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{area.short || 'N/A'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${area.enabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {area.enabled ? 'Aktiv' : 'Deaktiviert'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 mb-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Tische ({areaTables.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {areaTables.length > 0 ? areaTables.slice(0, 8).map(t => (
              <span key={t.id} className="text-sm bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-md text-slate-600 font-medium">
                {t.name}
              </span>
            )) : (
              <span className="text-sm text-slate-400 italic py-1">Keine Tische zugewiesen</span>
            )}
            {areaTables.length > 8 && (
              <span className="text-sm bg-slate-100 px-2 py-1.5 rounded-md text-slate-500 font-medium">+{areaTables.length - 8}</span>
            )}
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); openTableManager(area); }}
          className="mt-auto w-full py-3 px-4 bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-white hover:border-blue-500 hover:text-blue-600 font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Settings2 size={20} />
          Tische verwalten
        </button>
      </div>
    );
  };

  const activeAreaTables = managingArea ? tables.filter(t => t.areaId === managingArea.id) : [];
  const areAllActiveSelected = activeAreaTables.length > 0 && activeAreaTables.every(t => selectedTableIds.includes(t.id));

  return (
    <>
      <SimpleCardEditor<Area>
        title="Tischpläne"
        data={areas}
        renderCard={renderAreaCard}
        onAdd={(newArea) => {
          addArea(newArea);
        }}
        onEdit={(updatedArea) => {
          updateArea(updatedArea);
        }}
        onDelete={(id) => {
          if (confirm('Bereich und alle Tische löschen?')) {
            deleteArea(id);
          }
        }}
        fields={[
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'short', label: 'Kürzel', type: 'text' },
          { key: 'enabled', label: 'Aktiv', type: 'boolean' }
        ]}
      />

      {/* Table Manager Modal */}
      {managingArea && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-zoomIn">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Tische verwalten</h3>
                <p className="text-sm text-slate-500">Bereich: <span className="font-semibold text-blue-600">{managingArea.name}</span></p>
              </div>
              <button onClick={closeTableManager} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100">
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
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

                  <div className="bg-blue-100 text-blue-800 p-4 rounded-xl text-sm border border-blue-200">
                    Vorschau: <span className="font-bold">{bulkAddConfig.prefix} {bulkAddConfig.start}</span> ... <span className="font-bold">{bulkAddConfig.prefix} {bulkAddConfig.start + bulkAddConfig.count - 1}</span>
                  </div>

                  <button
                    onClick={handleBulkAdd}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 active:scale-95"
                  >
                    {bulkAddConfig.count} Tische generieren
                  </button>
                </div>
              </div>

              {/* Right Panel: Existing Tables List */}
              <div className="flex-1 flex flex-col min-h-0 bg-white">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shadow-sm z-10">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleAllTables}
                      className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                      title="Alle auswählen"
                    >
                      {areAllActiveSelected
                        ? <CheckSquare size={24} className="text-blue-600" />
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
                          for (const id of selectedTableIds) {
                            const table = activeAreaTables.find(t => t.id === id);
                            if (table) {
                              await updateTable({ ...table, enabled: !table.enabled });
                            }
                          }
                          setSelectedTableIds([]);
                        }}
                        className="flex items-center gap-2 text-yellow-700 bg-yellow-100 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-bold active:scale-95 ml-2"
                      >
                        <X size={18} />
                        {activeAreaTables.some(t => t.enabled && selectedTableIds.includes(t.id)) ? 'Deaktivieren' : 'Aktivieren'}
                      </button>
                    </>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {activeAreaTables.map(table => (
                      <div
                        key={table.id}
                        onClick={() => toggleTableSelection(table.id)}
                        className={`
                                cursor-pointer p-4 rounded-xl border-2 transition-all select-none flex items-center justify-between active:scale-95
                                ${!table.enabled ? 'bg-red-100 border-red-400 text-red-700' : selectedTableIds.includes(table.id)
                            ? 'bg-blue-50 border-blue-500 shadow-sm'
                            : 'bg-white border-transparent shadow-sm hover:border-blue-200'}
                              `}
                      >
                        <span className={`font-bold text-lg flex items-center gap-2 ${!table.enabled ? 'text-red-700' : selectedTableIds.includes(table.id) ? 'text-blue-700' : 'text-slate-600'}`}>
                          {table.name}
                          {!table.enabled && (
                            <span className="ml-1 px-2 py-0.5 bg-red-200 text-red-800 text-xs rounded-full font-semibold">Deaktiviert</span>
                          )}
                        </span>
                        {selectedTableIds.includes(table.id) && <CheckSquare size={20} className="text-blue-500" />}
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

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={closeTableManager}
                className="px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors font-bold active:scale-95 shadow-lg shadow-slate-200"
              >
                Fertig
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};