import React, { useState } from "react";
import type { OrderItem, Item, Unit, Table, Area, User, Category } from "../../types/models";
import { useAreas, useCreateOrder, useTables } from "../../types/queries";
import { QuantityBlink } from "../../ui/quantity-blink";
import { Link, useLocation } from "wouter";
import { TableSelectModal } from "./table-select";
import type { CurrentOrder } from "../../types/state";

type OrderDetailProps = {
  currentOrder: CurrentOrder;
  setCurrentOrder: (order: CurrentOrder | ((order: CurrentOrder) => CurrentOrder)) => void;
  items: Item[];
  units: Unit[];
  categories: Category[];
  user: User;
  updateOrderItemCount: (orderitem: OrderItem, count: number) => void;
};

function getTableButtonStyle(table?: Table & { area?: Area }) {
  if (!table || !table.area) return {};
  return {
    backgroundColor: table.area.color,
    color: table.area.textcolor,
  };
}

function openAmount(orderitems: OrderItem[]) {
  let total = 0;
  for (const orderitem of orderitems) {
    total += (orderitem.price || 0) * ((orderitem.count || 1) - (orderitem.countPaid || 0));
  }
  return total;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({
  units,
  items,
  currentOrder,
  setCurrentOrder,
  updateOrderItemCount,
}) => {
  const [tabbedIndex, setTabbedIndex] = useState<number | null>(null);
  const queryTables = useTables();
  const queryAreas = useAreas();
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [location, navigate] = useLocation();
  const createOrderMutation = useCreateOrder();

  if (queryTables.isLoading || queryAreas.isLoading) {
    return <div>Lade...</div>;
  }

  function saveOrder(onSuccess: () => void) {
    if (!table) {
      return;
    }
    createOrderMutation.mutate(
      {
        order: {
          tableId: table.id,
          orderitems: currentOrder.orderItems.map(oi => ({
            itemId: oi.itemId,
            count: oi.count,
            extras: oi.extras,
            price: oi.price,
          })),
        }
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  }

  function setTable(table: Table) {
    setCurrentOrder((co) => ({ ...co, tableId: table.id }));
  }

  const tables = queryTables.data?.tables || [];
  const areas = queryAreas.data?.areas || [];

  const table = tables.find(t => currentOrder.tableId && t.id === currentOrder.tableId);

  const currentTableArea = table ? areas.find(a => a.id === table.areaId) : undefined;
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Bestellung</h2>
      <div className="overflow-x-auto mb-4 overflow-y-auto max-h-96">
        <table className="min-w-full border rounded-lg">
          <tbody>
            {currentOrder.orderItems.map((orderitem, idx) => {
              const item = items.find(i => i.id === orderitem.itemId);
              const unit = item ? item.unitId ? units.find(u => u.id === item.unitId) : undefined : undefined;
              const isTabbed = tabbedIndex === idx;
              return (
                <tr key={orderitem.itemId + "_" + orderitem.extras} className={`relative ${isTabbed ? 'bg-gray-100' : 'hover:bg-blue-50 cursor-pointer'}`} onClick={() => !isTabbed && setTabbedIndex(idx)} style={{ height: '56px' }}>
                  <td className="px-2 py-1"><QuantityBlink quantity={orderitem.count} color="#000" /></td>
                  <td className="px-2 py-1" colSpan={2}>
                    {item?.name} {item?.amount}{unit?.name}
                    {orderitem.extras && <span> {orderitem.extras}</span>}
                  </td>
                  <td className="px-2 py-1">€ {(orderitem.price * orderitem.count).toFixed(2)}</td>
                  {isTabbed && (
                    <td
                      className="absolute left-0 top-0 w-full h-full flex items-center z-10"
                      style={{ padding: 0, background: 'rgba(243,244,246,0.85)' }} // Tailwind gray-100 with opacity
                      colSpan={4}
                    >
                      <div className="flex w-full justify-end gap-2 pr-4">
                        <button
                          className="block w-10 h-10 rounded bg-gray-200 text-xl flex items-center justify-center hover:bg-gray-300"
                          title="Abbrechen"
                          onClick={(e) => { e.stopPropagation(); setTabbedIndex(null); }}
                        >↩️</button>
                        <button
                          className="block w-10 h-10 rounded bg-blue-200 text-lg flex items-center justify-center hover:bg-blue-300"
                          title="-1"
                          onClick={(e) => { e.stopPropagation(); updateOrderItemCount(orderitem, orderitem.count - 1); if (orderitem.count - 1 <= 0) { setTabbedIndex(null); } }}
                        >- 1</button>
                        <button
                          className="block w-10 h-10 rounded bg-red-200 text-xl flex items-center justify-center hover:bg-red-300"
                          title="Löschen"
                          onClick={(e) => { e.stopPropagation(); updateOrderItemCount(orderitem, 0); setTabbedIndex(null); }}
                        >🗑️</button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4 justify-between">
        {table?.name ? (
          <button
            className="px-4 py-2 rounded bg-gray-200"
            style={getTableButtonStyle(table)}
            onClick={() => setShowTableModal(true)}
          >
            Tisch:  {currentTableArea?.short}{table.name}
          </button>
        ) : (
          <button className="px-4 py-2 rounded bg-red-200" onClick={() => {
            setShowTableModal(true)
          }}>
            <span role="img" >
              🪑
            </span>
            Tisch auswählen
          </button>
        )}
        <p className="font-bold text-lg">Summe: € {openAmount(currentOrder.orderItems).toFixed(2)}</p>

      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-20 flex items-center gap-2" disabled={!table} onClick={() => {
          saveOrder(() => {

            navigate("/order/pay");
          });
        }}>
          <span role="img" >✅</span>
          Bestellung abschicken
        </button>

        <Link
          className="px-4 py-2 rounded bg-gray-100 text-xl flex items-center justify-center"
          href="/order"
          title="Zurück"
        >Zurück</Link>
      </div>
      <TableSelectModal
        open={showTableModal}
        onClose={() => setShowTableModal(false)}
        tables={tables}
        areas={areas}
        onSelectTable={(table) => {
          setTable(table);
          setShowTableModal(false);
        }}
      />

    </div >
  );
};
