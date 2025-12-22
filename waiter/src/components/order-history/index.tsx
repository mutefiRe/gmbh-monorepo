import { Link } from "wouter";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useOrdersByUser, useTables, useAreas } from "../../types/queries";
import { useAuth } from "../../auth-wrapper";
import ProgressBar from "../common/ProgressBar";
import { Plus } from "lucide-react";
import { getOfflineOrders, subscribeOfflineOrders } from "../../lib/offlineOrders";
import { Notice } from "../../ui/notice";
import { pendingOrdersMessage } from "../../lib/offlineMessages";
import { useConnectionStatus } from "../../context/ConnectionStatusContext";

export function OrderHistory() {
  const auth = useAuth();
  const [filter, setFilter] = useState("orders");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const queryOrders = useOrdersByUser(auth.userId || "", page * pageSize, pageSize, { enabled: !!auth.userId });
  const queryTables = useTables();
  const queryAreas = useAreas();
  const connection = useConnectionStatus();
  const [offlineOrders, setOfflineOrders] = useState(() => getOfflineOrders({ userId: auth.userId ?? null, eventId: auth.eventId ?? null }));

  useEffect(() => {
    const scope = { userId: auth.userId ?? null, eventId: auth.eventId ?? null };
    const update = () => setOfflineOrders(getOfflineOrders(scope));
    const unsubscribe = subscribeOfflineOrders(update);
    update();
    return () => unsubscribe();
  }, [auth.eventId, auth.userId]);

  type OrderRow = {
    id: string;
    number?: string;
    createdAt?: string;
    tableId: string | null;
    customTableName?: string | null;
    orderitems: Array<{ count: number; countPaid?: number; price: number }>;
  };

  const orders: OrderRow[] = (queryOrders.data?.orders || []).map((order) => ({
    ...order,
    orderitems: order.orderitems || []
  }));
  const ordersLoadFailed = queryOrders.isError;
  const offlineRows: OrderRow[] = useMemo(() => {
    return offlineOrders.map((entry) => ({
      id: entry.id,
      number: "Offline",
      createdAt: entry.createdAt,
      tableId: entry.order.tableId,
      customTableName: entry.order.customTableName ?? null,
      orderitems: entry.order.orderitems.map((item) => ({
        count: item.count,
        countPaid: item.countPaid ?? 0,
        price: item.price
      }))
    }));
  }, [offlineOrders]);

  const total = queryOrders.data?.total ?? 0;
  const tables = queryTables.data?.tables || [];
  const areas = queryAreas.data?.areas || [];

  const uniqueDays = new Set(orders.flatMap((row) => {
    if (!row.createdAt) return [];
    const date = new Date(row.createdAt);
    return [date.toISOString().slice(0, 10)]; // YYYY-MM-DD
  }));
  const showFullDate = uniqueDays.size > 1;

  const isHistoryLoading = queryOrders.isLoading || queryTables.isLoading || queryAreas.isLoading;

  function renderTable(
    rows: OrderRow[],
    columns: Array<{
      label: string;
      className: string;
      tdClassName?: string;
      render: (order: any) => ReactNode;
    }>
  ) {
    return (
      <div className="orders flex-1 flex flex-col min-h-0">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-y-auto min-h-0">
          <table className="min-w-full">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className={col.className}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const rowClasses = idx % 2 === 0 ? "bg-white" : "bg-slate-50/60";
                return (
                  <Link href={`/orders/${row.id}`} key={row.id} className="contents">
                    <tr
                      className={`transition-colors duration-150 hover:bg-primary-50 border-b border-slate-100 last:border-b-0 cursor-pointer ${rowClasses}`}
                    >
                      {columns.map((col, i) => (
                        <td key={i} className={col.tdClassName || col.className}>
                          {col.render(row)}
                        </td>
                      ))}
                    </tr>
                  </Link>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Columns definition
  const columns: Array<{
    label: string;
    className: string;
    tdClassName?: string;
    render: (order: OrderRow) => ReactNode;
  }> = [
      {
        label: "Nr.",
        className: "px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-left",
        tdClassName: "px-4 py-3 text-left text-slate-700",
        render: (order) => order.number || order.id,
      },
      {
        label: "Uhrzeit",
        className: "px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-left",
        tdClassName: "px-4 py-3 text-left text-slate-700",
        render: (order) => {
          if (!order.createdAt) return "-";
          const date = new Date(order.createdAt);
          if (showFullDate) {
            return `${date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          } else {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        },
      },
      {
        label: "Tisch",
        className: "px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-left",
        tdClassName: "px-4 py-3 text-left text-slate-700",
        render: (order) => {
          if (!order.tableId) {
            return order.customTableName || "Ohne Tisch";
          }
          const table = tables.find(t => t.id === order.tableId);
          const area = table ? areas.find(a => a.id === table.areaId) : undefined;
          return `${area?.short || ''}${table?.name || ''}`;
        },
      },
      {
        label: "Artikel (bezahlt / gesamt)",
        className: "px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-center",
        tdClassName: "px-4 py-3 text-center text-slate-700",
        render: (order) => {
          let paidCount = 0;
          let totalCount = 0;
          order.orderitems.forEach((oi) => {
            paidCount += oi.countPaid || 0;
            totalCount += oi.count;
          });
          const percentPaid = totalCount === 0 ? 0 : Math.min(100, Math.round((paidCount / totalCount) * 100));
          return (
            <div className="flex flex-col items-center">
              <span>{paidCount} / {totalCount}</span>
              <ProgressBar percent={percentPaid} />
            </div>
          );
        },
      },
      {
        label: "Bezahlt / Gesamt (€)",
        className: "px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right",
        tdClassName: "px-4 py-3 text-right text-slate-700",
        render: (order) => {
          let paidPrice = 0;
          let totalPrice = 0;
          order.orderitems.forEach((oi) => {
            paidPrice += (oi.countPaid || 0) * oi.price;
            totalPrice += oi.count * oi.price;
          });
          return <span>{paidPrice.toFixed(2)} / {totalPrice.toFixed(2)}</span>;
        },
      },
    ];

  // Filtered rows for each view
  const openRows = orders.filter((order: { orderitems: Array<{ count: number; countPaid?: number }> }) => {
    let openCount = 0;
    order.orderitems.forEach((oi: { count: number; countPaid?: number }) => {
      openCount += oi.count - (oi.countPaid || 0);
    });
    return openCount > 0;
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page + 1, totalPages);
  const noServerOrders = ordersLoadFailed && orders.length === 0;
  const offlineNoticeMessage = pendingOrdersMessage(offlineOrders.length, connection.canReachServer);

  return (
    <div className="w-full flex flex-col items-center justify-start bg-gray-50 h-[calc(100dvh-56px)]">
      <div className="w-full max-w-screen-lg flex flex-col flex-1 p-4 h-full min-h-0">
        <h2 className="text-xl font-bold mb-3 text-gray-800">Bestellverlauf</h2>
        <div className="flex gap-3 mb-3">
          <button
            className={`default-btn px-4 py-2 rounded-lg font-semibold border transition-colors ${filter === "orders"
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-primary-50 hover:border-primary-300"
              }`}
            onClick={() => setFilter("orders")}
          >
            Bestellungen
          </button>
          <button
            className={`default-btn px-4 py-2 rounded-lg font-semibold border transition-colors ${filter === "tables"
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-primary-50 hover:border-primary-300"
              }`}
            onClick={() => setFilter("tables")}
          >
            Offene Bestellungen
          </button>
        </div>
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3 text-sm text-slate-500">
          <div className="space-y-2">
            {total === 0
              ? (offlineOrders.length > 0 ? 'Keine gesendeten Bestellungen' : 'Keine Bestellungen')
              : `Zeige ${page * pageSize + 1}-${page * pageSize + orders.length} von ${total}`}
            {offlineOrders.length > 0 && page === 0 && offlineNoticeMessage && (
              <Notice
                variant="warning"
                message={offlineNoticeMessage}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={page <= 0}
            >
              Zurück
            </button>
            <span className="text-slate-600">
              Seite {currentPage} von {totalPages}
            </span>
            <button
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={page >= totalPages - 1}
            >
              Weiter
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          {offlineRows.length > 0 && filter === "orders" && (
            <div className="mb-3 rounded-xl border border-amber-100 bg-amber-50/60">
              <div className="px-4 py-2 text-xs font-semibold text-amber-800 border-b border-amber-100">
                Nicht gesendet
              </div>
              <div className="max-h-[220px] overflow-y-auto">
                <table className="min-w-full text-sm">
                  <tbody>
                    {offlineRows.map((row, idx) => {
                      const table = tables.find(t => t.id === row.tableId);
                      const area = table ? areas.find(a => a.id === table.areaId) : undefined;
                      const tableLabel = row.tableId
                        ? `${area?.short || ''}${table?.name || ''}`
                        : row.customTableName || "Ohne Tisch";
                      const rowClasses = idx % 2 === 0 ? "bg-amber-50/60" : "bg-amber-100/40";
                      return (
                        <Link href={`/orders/${row.id}`} key={row.id} className="contents">
                          <tr className={`transition-colors hover:bg-amber-100 border-b border-amber-100 last:border-b-0 cursor-pointer ${rowClasses}`}>
                            <td className="px-4 py-3 text-left text-slate-700">
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[0.65rem] font-semibold">
                                  Ausstehend
                                </span>
                                <span>{row.number || row.id}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-left text-slate-700">
                              {row.createdAt
                                ? new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : "-"}
                            </td>
                            <td className="px-4 py-3 text-left text-slate-700">
                              {tableLabel}
                            </td>
                            <td className="px-4 py-3 text-right text-slate-700">
                              {row.orderitems.reduce((sum, item) => sum + item.count * item.price, 0).toFixed(2)} €
                            </td>
                          </tr>
                        </Link>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {isHistoryLoading ? (
            <div className="orders flex-1 flex flex-col min-h-0">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-y-auto min-h-0 animate-pulse">
                <table className="min-w-full">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                      {columns.map((col, idx) => (
                        <th key={idx} className={col.className}>
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 6 }).map((_, rowIdx) => (
                      <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                        {columns.map((_, colIdx) => (
                          <td key={colIdx} className="px-4 py-3">
                            <div className="h-4 w-full max-w-[140px] rounded-full bg-slate-200" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <>
              {filter === "orders" && (
                noServerOrders ? null : renderTable(orders, columns)
              )}
              {filter === "tables" && (
                noServerOrders ? null : renderTable(openRows, columns)
              )}
            </>
          )}
          {ordersLoadFailed && (
            <div className="mt-3">
              <Notice
                variant="error"
                message="Die Historie konnte nicht geladen werden. Bitte Verbindung prüfen oder später erneut versuchen."
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end w-full max-w-screen-lg p-4">
        <Link
          href="/order/new"
          className={() => "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary-300 text-primary-700 text-sm font-semibold hover:bg-primary-50 hover:border-primary-400 transition-colors"}
        >
          <Plus size={16} />
          Bestellung aufnehmen
        </Link>
      </div>
    </div>
  );
}
