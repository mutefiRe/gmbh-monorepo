import { useState } from "react";
import { Armchair, ChevronLeft, ReceiptText, Send } from "lucide-react";
import type { OrderItem, Item, Unit, Table, Area, Category } from "../../types/models";
import { useCreateOrder, usePrintOrder } from "../../types/queries";
import { QuantityBlink } from "../../ui/quantity-blink";
import { Link, useLocation } from "wouter";
import { TableSelectModal } from "./table-select";
import type { CurrentOrder } from "../../types/state";
import { useExtrasHistory } from "../../hooks/useExtrasHistory";
import { itemAmountString } from "../../lib/itemAmountString";
import { OrderItemActions } from "../../ui/order-item-actions";
import { useConnectionStatus } from "../../hooks/useConnectionStatus";
import { enqueueOfflineOrder } from "../../lib/offlineOrders";
import { useAuth } from "../../auth-wrapper";
import { Notice } from "../../ui/notice";
import { pendingOrdersMessage, pendingPaymentsMessage } from "../../lib/offlineMessages";
import { useOfflineOrderQueue } from "../../hooks/useOfflineOrderQueue";

type OrderDetailProps = {
  currentOrder: CurrentOrder;
  setCurrentOrder: (order: CurrentOrder | ((order: CurrentOrder) => CurrentOrder)) => void;
  items: Item[];
  units: Unit[];
  tables: Table[];
  areas: Area[];
  categories: Category[];
  updateOrderItemCount: (orderitem: OrderItem, count: number) => void;
};

function openAmount(orderitems: OrderItem[]) {
  let total = 0;
  for (const orderitem of orderitems) {
    total += (orderitem.price || 0) * ((orderitem.count || 1) - (orderitem.countPaid || 0));
  }
  return total;
}

export function OrderDetail({
  areas,
  tables,
  units,
  items,
  categories,
  currentOrder,
  setCurrentOrder,
  updateOrderItemCount,
}: OrderDetailProps) {
  const [tabbedIndex, setTabbedIndex] = useState<number | null>(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [, navigate] = useLocation();
  const createOrderMutation = useCreateOrder();
  const printMutation = usePrintOrder();
  const { recordExtrasForItems } = useExtrasHistory();
  const isSubmitting = createOrderMutation.isPending || printMutation.isPending;
  const connection = useConnectionStatus();
  const canReachServer = connection.canReachServer;
  const auth = useAuth();
  const { pendingOrders, pendingPayments } = useOfflineOrderQueue();
  const [notice, setNotice] = useState<{ message: string; variant?: "info" | "warning" | "error" | "success" } | null>(null);
  const pendingMessage = pendingOrdersMessage(pendingOrders, canReachServer);
  const paymentMessage = pendingPaymentsMessage(pendingPayments, canReachServer);

  async function saveOrder() {
    if (!table) {
      return;
    }
    if (!canReachServer) {
      const id = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const orderItemsWithIds = currentOrder.orderItems.map((oi) => ({
        id: typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        itemId: oi.itemId,
        count: oi.count,
        extras: oi.extras,
        price: Number(oi.price),
      }));
      enqueueOfflineOrder({
        id,
        createdAt: new Date().toISOString(),
        userId: auth.userId ?? null,
        eventId: auth.eventId ?? null,
        printId: currentOrder.printId || "",
        order: {
          id,
          tableId: table.id,
          orderitems: orderItemsWithIds
        }
      }, { userId: auth.userId ?? null, eventId: auth.eventId ?? null });
      setCurrentOrder({ orderItems: [], tableId: null, printId: "" });
      navigate(`/orders/${id}`);
      setNotice({ message: "Offline: Bestellung gespeichert und wird automatisch gesendet, sobald die Verbindung wieder da ist.", variant: "warning" });
      return;
    }
    try {
      setNotice(null);

    
    const data = await createOrderMutation.mutateAsync({
      order: {
        tableId: table.id,
        orderitems: currentOrder.orderItems.map(oi => ({
          itemId: oi.itemId,
          count: oi.count,
          extras: oi.extras,
          price: Number(oi.price),
        })),
      }
    });
    const orderID = data.order.id;

  
    // Trigger print after order is created
    await printMutation.mutateAsync({
      print: {
        orderId: orderID,
        printId: currentOrder.printId || "",
      }
    });
    recordExtrasForItems(
      currentOrder.orderItems.map(orderitem => ({
        itemId: String(orderitem.itemId),
        extras: orderitem.extras ?? null,
      }))
    );
    setCurrentOrder({ orderItems: [], tableId: null, printId: "" });
    navigate(`/orders/${orderID}`);
    } catch (error) {
      setNotice({ message: "Bestellung konnte nicht gesendet werden.", variant: "error" });
    }
  }

  function setTable(table: Table) {
    setCurrentOrder((co) => ({ ...co, tableId: table.id }));
  }


  const table = tables.find(t => currentOrder.tableId && t.id === currentOrder.tableId);

  const currentTableArea = table ? areas.find(a => a.id === table.areaId) : undefined;
  return (
    <div className="w-full max-w-screen-lg mx-auto px-3 pb-3 pt-1 h-[calc(100dvh-56px)] flex flex-col min-h-0">
      <div className="mb-2 shrink-0">
        <h2 className="text-xl font-bold text-slate-800">Bestellung</h2>
        <p className="text-xs text-slate-500">Positionen prüfen, Tisch wählen und abschicken.</p>
        {pendingMessage && (
          <div className="mt-2">
            <Notice message={pendingMessage} variant="warning" />
          </div>
        )}
        {paymentMessage && (
          <div className="mt-2">
            <Notice message={paymentMessage} variant="warning" />
          </div>
        )}
        {notice && (
          <div className="mt-2">
            <Notice message={notice.message} variant={notice.variant} />
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-4 overflow-hidden flex flex-col min-h-0 flex-1">
        <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded border border-slate-200 shadow-sm">
              <ReceiptText size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Positionen</h3>
              <p className="text-[0.7rem] text-slate-500">{currentOrder.orderItems.length} Artikel</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[0.7rem] text-slate-500">Summe</p>
            <p className="text-base font-bold text-slate-800">€ {openAmount(currentOrder.orderItems).toFixed(2)}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {currentOrder.orderItems.map((orderitem, idx) => {
            const item = items.find(i => i.id === orderitem.itemId);
            const unit = item ? item.unitId ? units.find(u => u.id === item.unitId) : undefined : undefined;
            const category = item ? categories.find(cat => cat.id === item.categoryId) : undefined;
            const categoryColor = category?.color || "#64748b";
            const isTabbed = tabbedIndex === idx;
            return (
              <div key={orderitem.itemId + "_" + orderitem.extras} className="px-3 py-1.5 relative">
                <button
                  className={`w-full flex items-center justify-between text-left rounded-lg px-2 py-1.5 transition ${isTabbed ? 'bg-primary-50 ring-1 ring-primary-200' : 'hover:bg-slate-50'}`}
                  onClick={() => setTabbedIndex(isTabbed ? null : idx)}
                  type="button"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="h-6 w-1 rounded-full" style={{ backgroundColor: categoryColor }} />
                    <QuantityBlink quantity={orderitem.count} color={categoryColor} />
                    <div className="min-w-0">
                      <p className="text-slate-800 font-medium truncate">
                        {item?.name}
                        {item?.amount && (
                          <span> {itemAmountString(item.amount)}{unit?.name}</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{orderitem.extras || 'Ohne Extras'}</p>
                    </div>
                  </div>
                  <span className="text-slate-600 font-medium">€ {(orderitem.price * orderitem.count).toFixed(2)}</span>
                </button>
                {isTabbed && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center gap-2 p-2 z-10">
                    <OrderItemActions
                      onDecrement={() => {
                        updateOrderItemCount(orderitem, orderitem.count - 1);
                      }}
                      onDelete={() => {
                        updateOrderItemCount(orderitem, 0);
                        setTabbedIndex(null);
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
          {currentOrder.orderItems.length === 0 && (
            <div className="p-6 text-center text-slate-400">
              Keine Positionen in dieser Bestellung.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-3 justify-between shrink-0">
        {table?.name ? (
          <button
            className="rounded-md border border-primary-300 bg-primary-50 px-4 py-2 text-primary-700"
            onClick={() => setShowTableModal(true)}
          >
            <span className="inline-flex items-center gap-2">
              <Armchair size={16} />
              Tisch: {currentTableArea?.short}{table.name}
            </span>
          </button>
        ) : (
          <button
            className="rounded-md border border-primary-200 bg-primary-50 px-4 py-2 text-primary-700"
            onClick={() => {
              setShowTableModal(true);
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Armchair size={16} />
              Tisch auswählen
            </span>
          </button>
        )}
        <p className="font-semibold text-slate-700">Summe: € {openAmount(currentOrder.orderItems).toFixed(2)}</p>
      </div>

      <div className="flex gap-2 shrink-0 justify-between items-center">
        <Link
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-slate-700"
          href="/order"
          title="Zurück"
        >
          <span className="inline-flex items-center gap-2">
            <ChevronLeft size={16} />
            Zurück
          </span>
        </Link>
        <button
          className="rounded-md bg-primary px-4 py-2 text-primary-contrast inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!table || isSubmitting}
          onClick={() => {
            saveOrder();
          }}
        >
          {isSubmitting ? 'Wird gesendet...' : 'Bestellung abschicken'}
          <Send size={16} />
        </button>
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
    </div>
  );
}
