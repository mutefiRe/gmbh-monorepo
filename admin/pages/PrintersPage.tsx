import React, { useContext } from 'react';
import { AppContext } from '../App';
import { SimpleCardEditor } from '../components/SimpleCardEditor';
import { Printer as PrinterIcon, Search } from 'lucide-react';
import { Printer } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';

export const PrintersPage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { printers, addPrinter, updatePrinter, deletePrinter, scanPrinters, isScanningPrinters } = context;

  const renderPrinterCard = (printer: Printer) => (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 text-slate-600">
        <PrinterIcon size={24} />
      </div>
      <div>
        <h3 className="font-bold text-slate-800">{printer.name}</h3>
        <p className="text-xs text-primary-500 font-mono mt-1">{printer.systemName}</p>
      </div>
    </div>
  );

  const scanButton = (
    <PrimaryButton
      onClick={scanPrinters}
      disabled={isScanningPrinters}
      className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-xl hover:bg-slate-200 transition-colors font-medium active:scale-95 border border-slate-200"
      icon={<Search size={20} className={isScanningPrinters ? 'animate-spin' : ''} />}
    >
      {isScanningPrinters ? 'Suche...' : 'Netzwerk scannen'}
    </PrimaryButton>
  );

  return (
    <SimpleCardEditor<Printer>
      title="Drucker"
      data={printers}
      renderCard={renderPrinterCard}
      onAdd={(item) => addPrinter(item)}
      onEdit={(item) => updatePrinter(item)}
      onDelete={(id) => deletePrinter(id)}
      customActions={scanButton}
      fields={[
        { key: 'name', label: 'Bezeichnung', type: 'text' },
        { key: 'systemName', label: 'IP / System-Name', type: 'text' }
      ]}
    />
  );
};