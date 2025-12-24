import React, { useContext } from 'react';
import { AppContext } from '../App';
import { SimpleCardEditor } from '../components/SimpleCardEditor';
import { LoadingNotice } from '../components/LoadingNotice';
import { Printer as PrinterIcon, Search } from 'lucide-react';
import { Printer } from '../types';

export const PrintersPage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { printers, addPrinter, updatePrinter, deletePrinter, scanPrinters, isScanningPrinters, printersLoading, printersSaving } = context;

  const renderPrinterCard = (printer: Printer) => {
    const transport = printer.transport === "usb"
      ? "USB"
      : printer.transport === "network"
        ? "Netzwerk"
        : printer.systemName?.toLowerCase().startsWith("usb:")
          ? "USB"
          : "Netzwerk";
    const networkInfo = printer.network?.ip
      ? `${printer.network.ip}:${printer.network.port}`
      : printer.labels?.ip
        ? `${printer.labels.ip}${printer.labels.port ? `:${printer.labels.port}` : ""}`
        : null;
    const usbInfo = printer.usb
      ? `${printer.usb.manufacturer || ""} ${printer.usb.product || ""}`.trim()
      : null;
    const usbIds = printer.usb
      ? `VID ${printer.usb.vid?.toString(16).padStart(4, "0")} / PID ${printer.usb.pid?.toString(16).padStart(4, "0")}`
      : null;
    const queueStatus = printer.queue
      ? `Queue: ${printer.queue.queued ?? 0}${printer.queue.capacity ? ` / ${printer.queue.capacity}` : ""}`
      : "Queue: -";
    const isDiscovered = printer.discovered !== false;
    return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 text-slate-600">
        <PrinterIcon size={24} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800">{printer.name}</h3>
          <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full ${printer.reachable ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {printer.reachable ? 'Online' : 'Offline'}
          </span>
          <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {transport}
          </span>
          {!isDiscovered && (
            <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              Nicht gefunden
            </span>
          )}
        </div>
        <p className="text-xs text-primary-500 font-mono mt-1">{printer.systemName}</p>
        {networkInfo && (
          <p className="text-xs text-slate-500">IP: {networkInfo}</p>
        )}
        {printer.network?.mac && (
          <p className="text-xs text-slate-500">MAC: {printer.network.mac}</p>
        )}
        {usbInfo && (
          <p className="text-xs text-slate-500">USB: {usbInfo}</p>
        )}
        {usbIds && (
          <p className="text-xs text-slate-500">{usbIds}</p>
        )}
        <p className="text-xs text-slate-500">{queueStatus}</p>
      </div>
    </div>
    );
  };

  const scanButton = (
    <button
      type="button"
      onClick={scanPrinters}
      disabled={isScanningPrinters}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-semibold active:scale-95 ${isScanningPrinters ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Search size={20} className={isScanningPrinters ? 'animate-spin' : ''} />
      {isScanningPrinters ? 'Suche...' : 'Netzwerk scannen'}
    </button>
  );

  return (
    <>
      <LoadingNotice active={printersLoading} />
      <SimpleCardEditor<Printer>
        title="Drucker"
        description="Drucker werden Kategorien oder Bereichen zugewiesen."
        isLoading={printersLoading}
        data={printers}
        gridClassName="grid grid-cols-1 gap-4"
        renderCard={renderPrinterCard}
        onAdd={(item) => addPrinter(item)}
        onEdit={(item) => updatePrinter(item)}
        onDelete={(id) => deletePrinter(id)}
        headerActions={scanButton}
        isSaving={printersSaving || isScanningPrinters}
        dialogHint="System-Name entspricht dem CUPS/Netzwerk-Namen des Druckers."
        fields={[
          { key: 'name', label: 'Bezeichnung', type: 'text' },
          { key: 'systemName', label: 'IP / System-Name', type: 'text', optional: true, readOnly: true }
        ]}
      />
    </>
  );
};
