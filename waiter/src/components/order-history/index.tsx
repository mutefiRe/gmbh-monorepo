import { Link } from "wouter";
import { useState } from "react";
import { useItems, useOrders, useTables } from "../../types/queries";

export function OrderHistory({ goToOrderDetail, onBack }) {
  const [filter, setFilter] = useState("orders");
  const queryOrders = useOrders();
  const queryItems = useItems();
  const queryTables = useTables();

  if (queryOrders.isLoading || queryItems.isLoading || queryTables.isLoading) {
    return <div>Lade...</div>;
  }

  const orders = queryOrders.data?.orders || [];
  const items = queryItems.data?.items || [];
  const tables = queryTables.data?.tables || [];
  const paidOrders = orders.filter(o => o.paid);
  const openOrders = orders.filter(o => !o.paid);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Bestellverlauf</h2>
      <div className="flex gap-2 mb-4">
        <button
          className={`default-btn ${filter === "orders" ? "active" : ""}`}
          onClick={() => setFilter("orders")}
        >
          Bestellungen
        </button>
        <button
          className={`default-btn ${filter === "tables" ? "active" : ""}`}
          onClick={() => setFilter("tables")}
        >
          Offene Tische
        </button>
      </div>

      {filter === "orders" && (
        <div className="orders">
          <div className="scrollable max-h-96 overflow-y-auto">
            <table className="min-w-full border rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-2 text-left">Status</th>
                  <th className="px-2 py-2 text-left">Bestell-ID</th>
                  <th className="px-2 py-2 text-left">Tisch</th>
                  <th className="px-2 py-2 text-left">Bestellte Artikel</th>
                </tr>
              </thead>
              <tbody>
                {paidOrders.map(order => (
                  <tr key={order.id} className="hover:bg-blue-50 cursor-pointer">
                    <td className="px-2 py-2">🟢</td>
                    <td className="px-2 py-2">
                      <Link href={`/orders/${order.id}`} className="underline text-blue-600">{order.id}</Link>
                    </td>
                    <td className="px-2 py-2">{order.tableId}</td>
                    <td className="px-2 py-2">
                      <ul>
                        {order.orderitems.map(oi => {
                          const item = items.find(i => i.id === oi.itemId);
                          return (
                            <li key={oi.id}>
                              {item ? item.name : 'Unbekannter Artikel'} - Menge: {oi.count} {oi.extras ? `(Extras: ${oi.extras})` : ''}
                            </li>
                          );
                        })}
                      </ul>
                    </td>
                  </tr>
                ))}
                {openOrders.map(order => (
                  <tr key={order.id} className="hover:bg-blue-50 cursor-pointer">
                    <td className="px-2 py-2">🟡</td>
                    <td className="px-2 py-2">
                      <Link href={`/orders/${order.id}`} className="underline text-blue-600">{order.id}</Link>
                    </td>
                    <td className="px-2 py-2">{order.tableId}</td>
                    <td className="px-2 py-2">
                      <ul>
                        {order.orderitems.map(oi => {
                          const item = items.find(i => i.id === oi.itemId);
                          return (
                            <li key={oi.id}>
                              {item ? item.name : 'Unbekannter Artikel'} - Menge: {oi.count} {oi.extras ? `(Extras: ${oi.extras})` : ''}
                            </li>
                          );
                        })}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filter === "tables" && (
        <div className="tables">
          <div className="scrollable max-h-96 overflow-y-auto">
            <table className="min-w-full border rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-2 text-left">Tisch</th>
                  <th className="px-2 py-2 text-left">Offener Betrag</th>
                </tr>
              </thead>
              <tbody>
                {tables
                  .filter(table => table.openAmount !== 0)
                  .map(table => (
                    <tr key={table.id} className="hover:bg-blue-50 cursor-pointer">
                      <td className="px-2 py-2">
                        <Link href={`/table/${table.id}`} className="underline text-blue-600">{table.shortname}</Link>
                      </td>
                      <td className="px-2 py-2">€{table.openAmount}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flexcontainer desktop mt-4 hidden md:flex">
        <button className="default-btn bigbutton" onClick={onBack}>
          Zurück
        </button>
      </div>
      <div className="flexcontainer mobile mt-4 flex md:hidden">
        <button className="default-btn bigbutton" onClick={onBack}>
          <span className="icon icon-return"></span>
        </button>
      </div>
    </div>
  );
}