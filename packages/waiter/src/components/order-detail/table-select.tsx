import { useEffect, useRef, useState } from "react";
import { Modal } from "../../ui/modal";
import type { Area, Table } from "../../types/models";

type TableSelectModalProps = {
  open: boolean;
  onClose: () => void;
  onSelectTable: (table: Table) => void;
  onSelectCustomTable: (name: string) => void;
  allowCustomTables?: boolean;
  customTableName?: string;
  tables: Table[];
  areas: Area[];
};

export function TableSelectModal({
  open, onClose,
  onSelectTable,
  onSelectCustomTable,
  allowCustomTables = false,
  customTableName = "",
  tables,
  areas
}: TableSelectModalProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [customName, setCustomName] = useState(customTableName);
  const customInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setCustomName(customTableName);
    }
  }, [customTableName, open]);

  const filteredTables = selectedAreaId
    ? tables.filter(table => table.areaId === selectedAreaId)
    : tables;
  const sortedTables = [...filteredTables].sort((a, b) =>
    a.name.localeCompare(b.name, "de", { numeric: true, sensitivity: "base" })
  );
  const trimmedCustomName = customName.trim();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tisch auswählen"
      contentClassName="w-[94vw] max-w-5xl"
    >
      <div className="mb-4 space-y-3">
        {allowCustomTables && (
          <div className="rounded-lg border border-slate-200 bg-white p-3 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-600">Benutzerdefinierter Tisch</label>
            <div className="flex flex-wrap gap-2">
              <input
                value={customName}
                onChange={(event) => setCustomName(event.target.value)}
                ref={customInputRef}
                className="flex-1 min-w-[180px] rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="z. B. Terrasse links"
              />
              <button
                type="button"
                className="rounded-lg border border-primary-300 text-primary-700 px-3 py-2 text-sm font-semibold hover:bg-primary-50"
                onClick={() => {
                  if (trimmedCustomName.length < 3) return;
                  onSelectCustomTable(trimmedCustomName);
                }}
                disabled={trimmedCustomName.length < 3}
              >
                Übernehmen
              </button>
            </div>
            <p className="text-[0.7rem] text-slate-500">Mindestens 3 Zeichen.</p>
          </div>
        )}
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
          {allowCustomTables && (
            <button
              type="button"
              className="w-full text-left p-3 rounded-lg border border-dashed border-primary-200 bg-primary-50/30 hover:bg-primary-50 transition-colors"
              onClick={() => {
                if (trimmedCustomName.length >= 3) {
                  onSelectCustomTable(trimmedCustomName);
                  return;
                }
                customInputRef.current?.focus();
              }}
            >
              <div className="text-xs uppercase tracking-wide text-primary-500 font-semibold">
                Benutzerdefiniert
              </div>
              <div className="text-base font-semibold text-slate-800">
                {trimmedCustomName.length ? trimmedCustomName : "Tischname eingeben"}
              </div>
            </button>
          )}
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
