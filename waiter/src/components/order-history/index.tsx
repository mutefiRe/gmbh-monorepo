import React from "react"; // Keep React import for JSX namespace
import { Link } from "wouter";
import { useState } from "react";
import { useItems, useOrdersByUser, useTables, useAreas } from "../../types/queries";
import { useAuth } from "../../auth-wrapper";
import ProgressBar from "../common/ProgressBar";

export function OrderHistory({ goToOrderDetail, onBack }: { goToOrderDetail: () => void; onBack: () => void }) {
  const auth = useAuth();
  const [filter, setFilter] = useState("orders");

  const queryOrders = useOrdersByUser(auth.userId || "", { enabled: !!auth.userId });
  const queryItems = useItems();
  const queryTables = useTables();
  const queryAreas = useAreas();

  if (queryOrders.isLoading || queryItems.isLoading || queryTables.isLoading) {
    return <div>Lade...</div>;
  }

  const orders = queryOrders.data?.orders || [];
  const tables = queryTables.data?.tables || [];
  const areas = queryAreas.data?.areas || [];

  const uniqueDays = new Set(orders.map((row: { createdAt: string }) => {
    const date = new Date(row.createdAt);
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  }));
  const showFullDate = uniqueDays.size > 0;

  function renderTable(
    rows: Array<{
      id: string;
      number: string;
      createdAt: string;
      tableId: string;
      orderitems: Array<{ count: number; countPaid?: number; price: number }>;
    }>,
    columns: Array<{
      label: string;
      className: string;
      tdClassName?: string;
      render: (order: any) => JSX.Element | string;
    }>
  ) {
    return (
      <div className="orders flex-1 flex flex-col h-full min-h-0">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 mb-6 overflow-y-auto">
          <table className="min-w-full shadow-lg overflow-hidden">
            <thead className="bg-gray-200 sticky top-0 z-10 rounded-t-lg">
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
                let totalCount = 0;
                let paidCount = 0;
                row.orderitems.forEach((oi) => {
                  totalCount += oi.count;
                  paidCount += oi.countPaid || 0;
                });
                const percentPaid = totalCount === 0 ? 0 : Math.min(100, Math.round((paidCount / totalCount) * 100));
                const rowStyle = {
                  backgroundColor: idx % 2 === 0 ? "#fff" : "#f9fafb", // white or gray-50
                };
                return (
                  <Link href={`/orders/${row.id}`} key={row.id} className="contents">
                    <tr
                      className={`transition-colors duration-150 hover:bg-blue-100 border-b last:border-b-0 cursor-pointer`}
                      style={rowStyle}
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
    render: (order: { number: string; createdAt: string; tableId: string; orderitems: Array<{ count: number; countPaid?: number; price: number; }> }) => JSX.Element | string;
  }> = [
      {
        label: "Nr.",
        className: "px-4 py-3 font-semibold text-gray-700 text-left",
        tdClassName: "px-4 py-3 text-left",
        render: (order) => order.number,
      },
      {
        label: "Uhrzeit",
        className: "px-4 py-3 font-semibold text-gray-700 text-left",
        tdClassName: "px-4 py-3 text-left",
        render: (order) => {
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
        className: "px-4 py-3 font-semibold text-gray-700 text-left",
        tdClassName: "px-4 py-3 text-left",
        render: (order) => {
          const table = tables.find(t => t.id === order.tableId);
          const area = table ? areas.find(a => a.id === table.areaId) : undefined;
          return `${area?.short || ''}${table?.name || ''}`;
        },
      },
      {
        label: "Artikel (bezahlt / gesamt)",
        className: "px-4 py-3 font-semibold text-gray-700 text-center",
        tdClassName: "px-4 py-3 text-center",
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
        className: "px-4 py-3 font-semibold text-gray-700 text-right",
        tdClassName: "px-4 py-3 text-right",
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
  const allRows = orders;
  const openRows = orders.filter((order: { orderitems: Array<{ count: number; countPaid?: number }> }) => {
    let openCount = 0;
    order.orderitems.forEach((oi: { count: number; countPaid?: number }) => {
      openCount += oi.count - (oi.countPaid || 0);
    });
    return openCount > 0;
  });

  return (
    <div className="w-full flex flex-col items-center justify-start bg-gray-50" style={{ minHeight: 'calc(100vh - 50px)' }}>
      <div className="w-full max-w-screen-lg flex flex-col flex-1 p-6 h-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Bestellverlauf</h2>
        <div className="flex gap-4 mb-6">
          <button
            className={`default-btn px-4 py-2 rounded-lg font-semibold ${filter === "orders" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setFilter("orders")}
          >
            Bestellungen
          </button>
          <button
            className={`default-btn px-4 py-2 rounded-lg font-semibold ${filter === "tables" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setFilter("tables")}
          >
            Offene Bestellungen
          </button>
        </div>
        <div className="flex-1 flex flex-col h-full">
          {filter === "orders" && renderTable(allRows, columns)}
          {filter === "tables" && renderTable(openRows, columns)}
        </div>
      </div>
      <div className="flex justify-end w-full max-w-screen-lg p-6">
        <button
          className="default-btn bigbutton px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
          onClick={() => window.location.href = '/order/new'}
        >
          <span className="icon icon-return"></span>
          Zurück zu Bestellung aufnehmen
        </button>
      </div>
    </div>
  );
}