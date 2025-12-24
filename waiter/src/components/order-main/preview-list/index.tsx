import type { Category, Item, OrderItem } from "../../../types/models";
import { useLocation } from "wouter";
import { QuantityBlink } from "../../../ui/quantity-blink";
import { useState } from "react";
import { OrderItemActions } from "../../../ui/order-item-actions";

type PreviewListProps = {
  orderItems: OrderItem[];
  items: Item[];
  categories: Category[];
  onChangeCount?: (orderItem: OrderItem, count: number) => void;
};



export function PreviewList({ orderItems, items, categories, onChangeCount }: PreviewListProps) {
  const [, navigate] = useLocation();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {orderItems.length === 0 ? (
          <div className="p-4 text-slate-500 text-sm">Noch keine Artikel.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {orderItems.map(orderItem => {
              const item = items?.find(i => i.id === orderItem.itemId);
              if (!item) return null;
              const category = categories.find(cat => cat.id === item.categoryId);
              const color = category?.color || '#64748b';
              const quantity = (orderItem.count ?? 1);
              const canEdit = Boolean(onChangeCount);
              const itemKey = `${item.id}__${orderItem.extras ?? ""}`;
              return (
                <li
                  key={itemKey}
                  className="px-2.5 py-1.5 sm:px-3 sm:py-2 relative cursor-pointer"
                  onClick={() => {
                    if (!canEdit) return;
                    setActiveKey(prev => (prev === itemKey ? null : itemKey));
                  }}
                >
                  <div className={`flex items-start gap-2 rounded-lg px-1.5 py-1 ${activeKey === itemKey ? "bg-primary-50 ring-1 ring-primary-200" : ""}`}>
                    <div className="flex items-center gap-1.5">
                      <span className="h-5 w-1 rounded-full" style={{ backgroundColor: color }} />
                      <QuantityBlink quantity={quantity} color={color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                      {orderItem.extras && (
                        <p className="text-[0.7rem] text-slate-500 truncate">Bemerkung: {orderItem.extras}</p>
                      )}
                    </div>
                  </div>
                  {canEdit && activeKey === itemKey && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center gap-2 p-2 z-10">
                      <OrderItemActions
                        onDecrement={() => onChangeCount?.(orderItem, (orderItem.count ?? 1) - 1)}
                        onDelete={() => onChangeCount?.(orderItem, 0)}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="hidden lg:flex p-4 border-t border-slate-200 bg-white justify-end">
        <button
          type="button"
          onClick={() => {
            navigate("/order/edit");
          }}
          className="rounded-lg border border-primary-300 text-primary-700 px-[12px] py-[6px] text-sm font-semibold hover:bg-primary-50 hover:border-primary-400 transition-colors active:scale-[0.99]"
        >
          Bestellung prüfen
        </button>
      </div>
    </div>
  );
}
