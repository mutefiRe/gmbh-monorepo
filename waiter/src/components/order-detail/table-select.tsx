import { useState } from "react";
import { Modal } from "../../ui/modal";
import { useAreas, useTables } from "../../types/queries";
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tisch auswählen"
    >
      <div className="mb-4">
        <label className="block mb-2 font-bold">Bereich auswählen:</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedAreaId || ""}
          onChange={(e) => setSelectedAreaId(e.target.value || null)}
        >
          <option value="">Alle Bereiche</option>
          {areas.map(area => (
            <option key={area.id} value={area.id}>{area.name}</option>
          ))}
        </select>
      </div>
      <div className="max-h-60 overflow-y-auto">
        <ul>
          {filteredTables.map(table => {
            const area = areas.find(a => a.id === table.areaId);
            if (!area) {
              return null;
            }

            return (
              <li key={table.id}>
                <button
                  className="w-full text-left p-2 hover:bg-gray-200 rounded"
                  onClick={() => {
                    onSelectTable(table);
                  }}
                >
                  {area.short} {table.name}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </Modal>
  );
} 