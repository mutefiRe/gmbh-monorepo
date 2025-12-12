import React, { useContext } from 'react';
import { AppContext } from '../App';
import { SimpleCardEditor } from '../components/SimpleCardEditor';
import { Ruler } from 'lucide-react';
import { Unit } from '../types';

export const UnitsPage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { units, addUnit, updateUnit, deleteUnit } = context;

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

  return (
    <SimpleCardEditor<Unit>
      title="Einheiten"
      data={units}
      renderCard={renderUnitCard}
      onAdd={(item) => addUnit(item)}
      onEdit={(item) => updateUnit(item)}
      onDelete={(id) => deleteUnit(id)}
      fields={[
        { key: 'name', label: 'Name', type: 'text' }
      ]}
    />
  );
};