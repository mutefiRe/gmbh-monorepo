import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Clock, Receipt, User } from 'lucide-react';
import { itemAmountString } from '@/lib/utils';

export const OrdersPage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { orders, tables, items, users, areas, units } = context;

  const getItemName = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) {
      return 'Unbekannter Artikel';
    }
    const unit = units.find(u => u.id === item.unitId);
    return `${item.name} ${itemAmountString(item.amount)}${unit ? `${unit.name}` : ''}`;
  };
  const getUserName = (id: string) => {
    const u = users.find(user => user.id === id);
    return u ? `${u.firstname} ${u.lastname}` : 'Unbekannter Mitarbeiter';
  };
  const getTableName = (id: string) => {
    const t = tables.find(table => table.id === id);
    const area = areas.find(a => a.id === t?.areaId);
    return t ? `Tisch ${area?.short}${t.name} (${area ? area.name : 'Unbekannter Bereich'})` : 'Unbekannter Tisch';
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Aktuelle Bestellungen</h1>
        <p className="text-slate-500">Übersicht über aktive Bestellungen und Status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map(order => {
          console.log('Rendering order', order);

          const allPaid = order.orderitems.every(oi => oi.countPaid && oi.countPaid >= oi.count);
          const totalPrice = order.orderitems.reduce((sum, oi) => sum + oi.price * oi.count, 0);

          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded border border-slate-200 shadow-sm">
                    <Receipt size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{getTableName(order.tableId)}</h3>
                    <p className="text-xs text-slate-500">Bestellung #{order.number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-lg font-bold text-slate-800">{totalPrice.toFixed(2)}€</span>
                  {allPaid ? <span className="text-xs text-green-500 font-medium bg-green-50 px-2 py-0.5 rounded-full">Bezahlt</span> : <span className="text-xs text-orange-500 font-medium bg-orange-50 px-2 py-0.5 rounded-full">Offen</span>}
                </div>
              </div>

              <div className="p-4 flex-1">
                <ul className="space-y-3">
                  {order.orderitems.map((oi, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {oi.count}x
                        </span>
                        <span className="text-slate-700">{getItemName(oi.itemId)}</span>
                      </div>
                      <span className="text-slate-500">{(oi.price * oi.count).toFixed(2)} €</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <User size={12} />
                  {getUserName(order.userId)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
            Keine aktiven Bestellungen im Moment.
          </div>
        )}
      </div>
    </div>
  );
};