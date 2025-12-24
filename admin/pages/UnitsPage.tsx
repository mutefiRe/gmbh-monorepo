import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { SimpleCardEditor } from '../components/SimpleCardEditor';
import { LoadingNotice } from '../components/LoadingNotice';
import { Plus, Ruler } from 'lucide-react';
import { Unit } from '../types';

export const UnitsPage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { units, addUnit, updateUnit, deleteUnit, unitsLoading, unitsSaving } = context;

  const renderUnitCard = (unit: Unit) => (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
        <Ruler size={24} />
      </div>
      <div>
        <h3 className="font-bold text-slate-800">{unit.name}</h3>
        <p className="text-xs text-slate-400 mt-1">ID: {unit.id}</p>
      </div>
    </div>
  );

  const isBusy = unitsLoading || unitsSaving;
  const addButton = (
    <Link
      to={'new'}
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
      {unitsSaving ? 'Speichert...' : 'Hinzufügen'}
    </Link>
  );

  return (
    <>
      <LoadingNotice active={unitsLoading} />
      <SimpleCardEditor<Unit>
        gridClassName='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
        title="Einheiten"
        description="Einheiten werden bei Artikeln angezeigt, z.B. l, cl oder Stk."
        isLoading={unitsLoading}
        isSaving={unitsSaving}
        data={units}
        renderCard={renderUnitCard}
        onAdd={(item) => addUnit(item)}
        onEdit={(item) => updateUnit(item)}
        onDelete={(id) => deleteUnit(id)}
        headerActions={addButton}
        dialogHint="Kurz und eindeutig, damit die Anzeige in der Kasse sauber bleibt."
        fields={[
          { key: 'name', label: 'Name', type: 'text' }
        ]}
      />
    </>
  );
};
