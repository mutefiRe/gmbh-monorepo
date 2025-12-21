import { useState } from "react";
import { Printer } from "lucide-react";
import { useOrder, usePrintOrder, useUpdateOrder } from "../../types/queries";
import type { Area, Category, Item, OrderItem, Table, Unit } from "../../types/models";
import { itemAmountString } from "../../lib/itemAmountString";
import { useQueryClient } from "@tanstack/react-query";
import { useConnectionStatus } from "../../hooks/useConnectionStatus";
import { enqueueOfflinePayment, hasPendingPayment } from "../../lib/offlinePayments";
import { useAuth } from "../../auth-wrapper";

type PayDetailProps = {
  orderId: string;
  items: Item[];
  units: Unit[];
  tables: Table[];
  areas: Area[];
  categories: Category[];
};

export function PayDetail({
  orderId,
  items,
  units,
  categories,
  tables,
  areas,
}: PayDetailProps) {
  const orderQuery = useOrder(orderId);
  const [forFree] = useState(false);
  const updateOrderMutation = useUpdateOrder();
  const printMutation = usePrintOrder();
  const client = useQueryClient();
  const connection = useConnectionStatus();
  const canReachServer = connection.canReachServer;
  const auth = useAuth();
  const order = orderQuery.data?.order;
  const orderitems = order?.orderitems || [];
  const [itemMarks, setItemMarks] = useState<Record<string, number>>(() => {
    const entries = (order?.orderitems || [])
      .flatMap(item => (item.id ? [[item.id, 0]] : []));
    return Object.fromEntries(entries);
  });
  const isPaying = updateOrderMutation.isPending;
  const isPrinting = printMutation.isPending;
  const pendingPayment = order?.id
    ? hasPendingPayment(order.id, { userId: auth.userId ?? null, eventId: auth.eventId ?? null })
    : false;
  const openAmount = orderitems.reduce((sum, oi) => sum + ((oi.count - (oi.countPaid || 0)) * oi.price), 0);
  const markedAmount = orderitems.reduce((sum, oi) => {
    const id = oi.id ?? "";
    return sum + ((itemMarks[id] || 0) * oi.price);
  }, 0);
  const table = tables.find(t => t.id === order?.tableId);
  const area = table ? areas.find(a => a.id === table.areaId) : undefined;
  function incrementMarked(id: string, max: number) {
    setItemMarks(prev => ({ ...prev, [id]: Math.min((prev[id] || 0) + 1, max) }));
  }
  function decrementMarked(id: string) {
    setItemMarks(prev => ({ ...prev, [id]: Math.max((prev[id] || 0) - 1, 0) }));
  }
  async function onReprint() {
    if (!order?.id) {
      alert("Bestellung nicht verfügbar.");
      return;
    }
    if (!canReachServer) {
      alert("Offline: Drucken ist deaktiviert.");
      return;
    }
    const printedCount = order.printCount ?? 0;
    const warning = printedCount > 0
      ? `Dieser Bon wurde bereits ${printedCount}x gedruckt.\n\nBitte nur erneut drucken, wenn der Druck wirklich verloren gegangen ist.`
      : "Bitte nur drucken, wenn der Druck wirklich verloren gegangen ist.";
    const confirmed = window.confirm(`Bestellungsbon nochmal drucken?\n\n${warning}`);
    if (!confirmed) return;
    await printMutation.mutateAsync({
      print: {
        orderId: order.id,
        printId: ""
      }
    });
    await client.invalidateQueries({ queryKey: ["order", orderId] });
  }
  async function onPaySelected() {
    if (!order?.id) {
      alert("Bestellung nicht verfügbar.");
      return;
    }
    const orderPayment: { id: string; orderitems: Array<Pick<OrderItem, 'id' | 'price' | 'countPaid' | 'countFree' | 'count'>> } = {
      id: order.id,
      orderitems: Object.entries(itemMarks).map(([id, count]) => {
        const originalItem = orderitems.find(oi => oi.id === id);
        return {
          id,
          price: Number(originalItem?.price || 0),
          countPaid: (originalItem?.countPaid || 0) + count,
          countFree: forFree ? count : 0,
          count: originalItem?.count || 0,
        };
      }),
    };
    if (!canReachServer) {
      const queueId = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      enqueueOfflinePayment({
        id: queueId,
        createdAt: new Date().toISOString(),
        userId: auth.userId ?? null,
        eventId: auth.eventId ?? null,
        orderId: order.id,
        order: orderPayment as any
      }, { userId: auth.userId ?? null, eventId: auth.eventId ?? null });
      setItemMarks({});
      alert("Offline: Zahlung gespeichert und wird automatisch übertragen, sobald die Verbindung wieder da ist.");
      return;
    }
    await updateOrderMutation.mutateAsync({ order: orderPayment });
    await client.invalidateQueries({ queryKey: ['order', orderId] });
    setItemMarks({});
  }
  if (orderQuery.isError) return <div>Fehler beim Laden der Bestellung.</div>;
  if (!order) return <div>Bestellung nicht gefunden.</div>;

  return (
    <div className="w-full max-w-screen-lg mx-auto px-3 pb-3 pt-1 h-[calc(100dvh-56px)] flex flex-col min-h-0">
      <div className="mb-2 shrink-0">
        <h2 className="text-xl font-bold text-slate-800">Zahlung</h2>
        <p className="text-xs text-slate-500">Bestellung prüfen und bezahlte Positionen markieren.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-4 overflow-hidden flex flex-col min-h-0 flex-1">
        <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            <p className="text-sm font-semibold text-slate-800">Bestellung Nr. {order?.number || order?.id}</p>
            {order.tableId && (
              <p className="text-xs text-slate-500">Tisch: {area?.short}{table?.name}</p>
            )}
            {pendingPayment && (
              <p className="text-[0.7rem] text-amber-700 font-semibold">Zahlung wartet auf Sync</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-[0.7rem] text-slate-500">Auswahl</p>
            <p className="text-base font-bold text-slate-800">€ {markedAmount.toFixed(2)}</p>
          </div>
        </div>
        <div className="px-3 py-2 border-b border-slate-100 bg-white flex items-center justify-between gap-2">
          <div className="text-xs text-slate-500">
            Bereits gedruckt: <span className="font-semibold text-slate-700">{order.printCount ?? 0}x</span>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-md border border-primary-500 bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-50 disabled:opacity-50 disabled:border-slate-200 disabled:text-slate-400"
            onClick={onReprint}
            disabled={!canReachServer || isPrinting}
          >
            <Printer size={14} />
            Bon nochmal drucken
          </button>
        </div>

        {orderitems.length === 0 ? (
          <div className="flex items-center justify-center h-full text-lg font-semibold text-slate-400">Keine Artikel vorhanden.</div>
        ) : (
          <>
            {!canReachServer && (
              <div className="px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50 border-b border-amber-100">
                Offline: Zahlung wird gespeichert, Drucken ist deaktiviert.
              </div>
            )}
            {orderitems.every(oi => oi.countPaid && oi.countPaid >= oi.count) && (
              <div className="px-4 py-3 text-center text-sm font-semibold text-emerald-700 bg-emerald-50 border-b border-emerald-100">
                Alles bezahlt
              </div>
            )}
            <div className="flex-1 overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 sticky top-0 z-10 text-slate-500">
                  <tr>
                    <th className="px-2 py-2 sm:px-3 font-semibold text-left w-24">Markieren</th>
                    <th className="px-2 py-2 sm:px-4 font-semibold text-left">Artikel</th>
                    <th className="px-2 py-2 sm:px-4 font-semibold text-left">Bezahlt</th>
                    <th className="px-2 py-2 sm:px-4 font-semibold text-right">Summe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orderitems.map((orderitem) => {
                    const id = orderitem.id ?? "";
                    const item = items.find(i => i.id === orderitem.itemId);
                    const unit = units.find(u => u.id === item?.unitId);
                    const category = categories.find(c => c.id === item?.categoryId);
                    const marked = itemMarks[id] || 0;
                    const maxMarkable = orderitem.count - (orderitem.countPaid || 0);

                    let name = "Unbekannter Artikel";
                    if (item) {
                      name = item.name;
                      if (category?.showAmount) {
                        name += ` ${itemAmountString(item.amount)} ${unit?.name || ''}`;
                      }
                      if (orderitem.extras) {
                        name += ' *';
                      }
                    }

                    const offen = Math.max(0, orderitem.count - (orderitem.countPaid || 0));
                    const isPaid = offen === 0;

                    return (
                      <tr
                        key={id}
                        className={`transition-colors ${isPaid ? 'bg-emerald-50' : 'bg-white'} ${marked > 0 ? 'bg-primary-50' : ''}`}
                      >
                        <td className="px-2 py-2 sm:px-3 text-center whitespace-nowrap">
                          {isPaid ? (
                            <span className="text-emerald-600 text-base font-bold">✓</span>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                className="h-8 w-8 rounded-lg border border-primary-300 bg-white text-primary hover:border-primary-500 disabled:opacity-50 disabled:border-slate-200 disabled:text-slate-400"
                                onClick={() => decrementMarked(id)}
                                disabled={marked === 0 || isPaying}
                              >
                                -
                              </button>
                              <span className="px-1 font-mono font-bold text-base text-slate-700">{marked}</span>
                              <button
                                className="h-8 w-8 rounded-lg border border-primary-500 bg-primary text-primary-contrast hover:bg-primary-600 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-200"
                                onClick={() => incrementMarked(id, maxMarkable)}
                                disabled={marked === maxMarkable || isPaying}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-2 sm:px-4">
                          <div className="font-medium text-slate-800">{name}</div>
                          {orderitem.extras && (
                            <div className="text-xs text-slate-500">{orderitem.extras}</div>
                          )}
                        </td>
                        <td className="px-2 py-2 sm:px-4 text-left">
                          <div className="text-sm text-slate-700">
                            {`${orderitem.countPaid || 0} / ${orderitem.count}`}
                          </div>
                          <div className="w-full h-1.5 mt-1 bg-slate-100 rounded">
                            <div
                              className="h-1.5 rounded bg-emerald-500 transition-all"
                              style={{ width: `${Math.round(((orderitem.countPaid || 0) / orderitem.count) * 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-2 py-2 sm:px-4 text-right text-slate-700">
                          € {(orderitem.price * orderitem.count).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-3 justify-between shrink-0">
        <div className="text-sm text-slate-600">
          Offen: <span className="font-semibold text-slate-800">€ {openAmount.toFixed(2)}</span>
        </div>
        <div className="text-sm text-slate-600">
          Auswahl: <span className="font-semibold text-slate-800">€ {markedAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2 shrink-0 justify-between items-center">
        <button
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-slate-700"
          onClick={() => window.history.back()}
          disabled={isPaying || isPrinting}
        >
          <span className="inline-flex items-center gap-2">
            <span className="icon icon-return"></span>
            Zurück zu den Bestellungen
          </span>
        </button>
        {!orderitems.every(oi => oi.countPaid && oi.countPaid >= oi.count) && (
          <button
            className="rounded-md bg-primary px-4 py-2 text-primary-contrast inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onPaySelected}
            disabled={markedAmount === 0 || isPaying || isPrinting}
          >
            <span className="icon icon-pay"></span>
            {isPaying ? 'Zahlung läuft...' : `Ausgewählte bezahlen (€ ${markedAmount.toFixed(2)})`}
          </button>
        )}
      </div>
    </div>
  );
}
