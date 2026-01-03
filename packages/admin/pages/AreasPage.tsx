import React, { useContext } from 'react';
import { useParams, useNavigate, useMatch, Link } from 'react-router-dom';
import { TableManager } from '../components/TableManager';
import { AppContext } from '../App';
import { SimpleCardEditor } from '../components/SimpleCardEditor';
import { LoadingNotice } from '../components/LoadingNotice';
import { Area } from '../types';
import { MapPin, Plus, Settings2 } from 'lucide-react';
import { api } from '@/services/api';

export const AreasPage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { areas, addArea, updateArea, deleteArea, tables, createTable, updateTable, deleteTable, areasLoading, areasSaving, tablesLoading, tablesSaving } = context;
  const params = useParams();
  const navigate = useNavigate();
  const matchesTables = useMatch('/areas/:id/tables');

  const renderAreaCard = (area: Area) => {
    const areaTables = tables.filter(t => t.areaId === area.id);
    const activeAreaTables = areaTables.filter(t => t.enabled);
    const inactiveAreaTables = areaTables.filter(t => !t.enabled);
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
            {activeAreaTables.length > 0 ? activeAreaTables.slice(0, 8).map(t => (
              <span key={t.id} className="text-sm bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-md text-slate-600 font-medium">
                {t.name}
              </span>
            )) : (
              <span className="text-sm text-slate-400 italic py-1">Keine Tische zugewiesen</span>
            )}
            {activeAreaTables.length > 8 && (
              <span className="text-sm bg-slate-100 px-2 py-1.5 rounded-md text-slate-500 font-medium">+{activeAreaTables.length - 8}</span>
            )}
            {inactiveAreaTables.length && (
              <span className="text-sm bg-red-100  px-2 py-1.5 rounded-md text-red-500 font-medium">+{inactiveAreaTables.length} inaktiv</span>
            )}
          </div>

        </div>

        <Link
          component="button"
          to={`${area.id}/tables`}
          className="mt-auto w-full py-3 px-4 bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-white hover:border-primary-500 hover:text-primary font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Settings2 size={20} />
          Tische verwalten
        </Link>
      </div>
    );
  };

  if (matchesTables?.params.id) {
    const area = areas.find(a => a.id === params.id);
    if (!area) return <div>Bereich nicht gefunden</div>;

    return (
      <TableManager
        area={area}
        tables={tables}
        onClose={() => navigate('/areas')}
        createTable={createTable}
        updateTable={updateTable}
        deleteTable={deleteTable}
        isSaving={tablesSaving}
        api={api}
      />
    );
  }

  const isBusy = areasLoading || areasSaving || tablesLoading;
  const addButton = (
    <Link
      to={'/areas/new'}
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
      {areasSaving ? 'Speichert...' : 'Hinzufügen'}
    </Link>
  );

  return (
    <>
      <LoadingNotice active={areasLoading || tablesLoading} />
      <SimpleCardEditor<Area>
        gridClassName='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
        title="Tischpläne"
        description="Bereiche strukturieren die Tische und erscheinen in Bestellungen."
        isLoading={areasLoading || tablesLoading}
        isSaving={areasSaving}
        data={areas}
        // You may need to update renderCard to use TableManager via routing if not already done
        renderCard={renderAreaCard}
        onAdd={addArea}
        onEdit={updateArea}
        onDelete={id => {
          if (confirm('Bereich und alle Tische löschen?')) {
            deleteArea(id);
          }
        }}
        headerActions={addButton}
        dialogHint="Kürzel wird in der Kasse vor dem Tischnamen angezeigt."
        fields={[
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'short', label: 'Kürzel', type: 'text' },
          { key: 'enabled', label: 'Aktiv', type: 'boolean' }
        ]}
      />
    </>
  );
};
