import { useState } from "react";
import { useOrder, useUpdateOrder } from "../../types/queries";
import type { Area, Category, Item, OrderItem, Table, Unit } from "../../types/models";
import { itemAmountString } from "../../lib/itemAmountString";
import { useQueryClient } from "@tanstack/react-query";

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
  const [forFree, setForFree] = useState(false);
  const updateOrderMutation = useUpdateOrder();
  const client = useQueryClient();
  const order = orderQuery.data?.order;
  const orderitems = order?.orderitems || [];
  const [itemMarks, setItemMarks] = useState<Record<string, number>>(() => Object.fromEntries((order?.orderitems || []).map(item => [item.id, 0])));
  const openAmount = orderitems.reduce((sum, oi) => sum + ((oi.count - (oi.countPaid || 0)) * oi.price), 0);
  const markedAmount = orderitems.reduce((sum, oi) => sum + ((itemMarks[oi.id] || 0) * oi.price), 0);
  const table = tables.find(t => t.id === order?.tableId);
  const area = table ? areas.find(a => a.id === table.areaId) : undefined;
  function incrementMarked(id: string, max: number) {
    setItemMarks(prev => ({ ...prev, [id]: Math.min((prev[id] || 0) + 1, max) }));
  }
  function decrementMarked(id: string) {
    setItemMarks(prev => ({ ...prev, [id]: Math.max((prev[id] || 0) - 1, 0) }));
  }
  function markAll() {
    setItemMarks(prev => Object.fromEntries(orderitems.map(item => [item.id, item.count - (item.countPaid || 0)])));
  }
  function unmarkAll() {
    setItemMarks(prev => Object.fromEntries(orderitems.map(item => [item.id, 0])));
  }
  async function onPaySelected() {
    const orderPayment = {
      id: order?.id,
      orderitems: Object.entries(itemMarks).map(([id, count]) => {
        const originalItem = orderitems.find(oi => oi.id === id);
        return {
          id,
          price: originalItem?.price || 0,
          countPaid: (originalItem?.countPaid || 0) + count,
          countFree: forFree ? count : 0,
          count: originalItem?.count || 0,
        };
      }),
    };
    await updateOrderMutation.mutateAsync({ order: orderPayment });
    await client.invalidateQueries({ queryKey: ['order', orderId] });
    setItemMarks({});
  }
  if (orderQuery.isError) return <div>Fehler beim Laden der Bestellung.</div>;
  if (!order) return <div>Bestellung nicht gefunden.</div>;

  // Table rendering
  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 sm:px-6 rounded-none sm:rounded-lg flex flex-col min-h-[calc(100vh-50px)]">
      <div className="flex items-center justify-between mb-4 mt-4">
        <h2 className="text-xl font-bold text-gray-800">Bestellung Nr. {order?.number || order?.id}</h2>
        {order.tableId && (
          <span className="font-semibold text-blue-700 text-right">Tisch: {area?.short}{table?.name}</span>
        )}
      </div>
      {/* Items as table with granular marking */}
      {orderitems.length === 0 ? (
        <div className="flex items-center justify-center h-full text-2xl font-bold text-green-700">Keine Artikel vorhanden!</div>
      ) : (
        <>
          {orderitems.every(oi => oi.countPaid && oi.countPaid >= oi.count) && (
            <div className="flex items-center justify-center h-full text-2xl font-bold text-green-700">Alles bezahlt!</div>
          )}
          <div className="scrollable mb-6 p-0 -mx-4 sm:-mx-6 flex-grow overflow-auto">
            <table className="min-w-full md:rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 text-left">Status / Markieren</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 text-left">Artikel</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 text-left">Bezahlt / Gesamt</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 text-left">Preis bezahlt / gesamt (€)</th>
                </tr>
              </thead>
              <tbody>
                {orderitems.map((orderitem, idx) => {
                  const id = orderitem.id || "";
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
                      className={`transition-colors duration-150 ${isPaid ? 'bg-green-50' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-100 ${marked > 0 ? 'bg-blue-50' : ''} border-b last:border-b-0`}
                    >
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-center whitespace-nowrap">
                        {isPaid ? (
                          <span className="text-green-600 text-xl font-bold">✓</span>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <button className="relative px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50" style={{ minWidth: 40, minHeight: 40 }} onClick={() => decrementMarked(id)} disabled={marked === 0}>
                              <span className="absolute inset-0 flex items-center justify-center pointer-events-none text-base">-</span>
                            </button>
                            <span className="px-3 font-mono font-bold text-lg">{marked}</span>
                            <button className="relative px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50" style={{ minWidth: 40, minHeight: 40 }} onClick={() => incrementMarked(id, maxMarkable)} disabled={marked === maxMarkable}>
                              <span className="absolute inset-0 flex items-center justify-center pointer-events-none text-base">+</span>
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3">{name}</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                        {`${orderitem.countPaid || 0} / ${orderitem.count}`}
                        <div className="w-full h-2 mt-1 bg-gray-200 rounded">
                          <div
                            className="h-2 rounded bg-green-500 transition-all"
                            style={{ width: `${Math.round(((orderitem.countPaid || 0) / orderitem.count) * 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-right">{`${(orderitem.price * (orderitem.countPaid || 0)).toFixed(2)} / ${(orderitem.price * orderitem.count).toFixed(2)}`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-4 mb-6 mt-auto">
            <button
              className="default-btn flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              onClick={() => window.history.back()}
            >
              <span className="icon icon-return"></span>
              Zurück zu den Bestellungen
            </button>
            {!orderitems.every(oi => oi.countPaid && oi.countPaid >= oi.count) && (
              <button
                className={`bigbutton default-btn flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white transition ${markedAmount > 0 ? 'hover:bg-green-700' : 'opacity-50 cursor-not-allowed'}`}
                onClick={onPaySelected}
                disabled={markedAmount === 0}
              >
                <span className="icon icon-pay"></span>
                Ausgewählte bezahlen
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
