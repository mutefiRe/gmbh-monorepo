import { useState } from "react";
import { Modal } from "../../ui/modal";
import type { Area, Table } from "../../types/models";

type TableSelectModalProps = {
  open: boolean;
  onClose: () => void;
  onSelectTable: (table: Table) => void;
  tables: Table[];
  areas: Area[];
};

export function TableSelectModal({
  open, onClose,
  onSelectTable,
  tables,
  areas
}: TableSelectModalProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  const filteredTables = selectedAreaId
    ? tables.filter(table => table.areaId === selectedAreaId)
    : tables;
  const sortedTables = [...filteredTables].sort((a, b) =>
    a.name.localeCompare(b.name, "de", { numeric: true, sensitivity: "base" })
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tisch auswählen"
      contentClassName="w-[94vw] max-w-5xl"
    >
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedAreaId(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
              selectedAreaId === null
                ? "bg-primary-50 border-primary-300 text-primary-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Alle Bereiche
          </button>
          {areas.map(area => (
            <button
              key={area.id}
              type="button"
              onClick={() => setSelectedAreaId(area.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                selectedAreaId === area.id
                  ? "bg-primary-50 border-primary-300 text-primary-700"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-[60vh] overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {sortedTables.map(table => {
            const area = areas.find(a => a.id === table.areaId);
            if (!area) {
              return null;
            }

            return (
              <button
                key={table.id}
                className="w-full text-left p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-primary-50 hover:border-primary-300 transition-colors"
                onClick={() => {
                  onSelectTable(table);
                }}
              >
                <div className="text-base font-semibold text-slate-800">
                  {area.short} {table.name}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </Modal>
  );
} 
