import { useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { CategoryList } from "./category-list";
import type { Category, Item, Unit } from "../../types/models";
import { ProductList } from "./product-list";
import { PreviewList } from "./preview-list";
import type { CurrentOrder } from "../../types/state";
import type { OrderItem } from "../../types/models";
import { Notice } from "../../ui/notice";
import { pendingOrdersMessage, pendingPaymentsMessage } from "../../lib/offlineMessages";

interface OrderMainProps {
  categories: Category[];
  units: Unit[];
  items: Item[];
  currentOrder: CurrentOrder;
  addItemToOrder: (item: OrderItem) => void;
  updateOrderItemCount: (orderItem: OrderItem, count: number) => void;
  canReachServer?: boolean;
  pendingOrders?: number;
  pendingPayments?: number;
  children?: ReactNode;
}

export function OrderMain({
  categories,
  units,
  items,
  addItemToOrder,
  currentOrder,
  updateOrderItemCount,
  canReachServer = true,
  pendingOrders = 0,
  pendingPayments = 0,
  children,
}: OrderMainProps) {
  const [, navigate] = useLocation();


  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const pendingMessage = pendingOrdersMessage(pendingOrders, canReachServer);
  const paymentMessage = pendingPaymentsMessage(pendingPayments, canReachServer);


  return (<>
    {children}
    <div className="grid grid-rows-[auto_1fr_auto] h-[calc(100dvh-60px)] w-full overflow-x-hidden bg-slate-50">
      {pendingMessage && (
        <div className="px-3 pt-3">
          <Notice variant="warning" message={pendingMessage} />
        </div>
      )}
      {paymentMessage && (
        <div className="px-3 pt-3">
          <Notice variant="warning" message={paymentMessage} />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-10 w-full h-[calc(100%)] gap-3 p-3 overflow-x-hidden min-h-0">
        <section className="lg:col-span-7 h-full overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-0 order-2 lg:order-1">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
            <h3 className="text-sm font-semibold text-slate-700">Artikel</h3>
          </div>
          <div className="lg:hidden border-b border-slate-100 bg-white">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <ProductList
              items={items}
              selectedCategory={selectedCategory}
              categories={categories}
              addItemToOrder={addItemToOrder}
              units={units}
              orderItems={currentOrder.orderItems}
            />
          </div>
        </section>
        <aside className="lg:col-span-3 h-[28vh] sm:h-[32vh] lg:h-full overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-0 order-1 lg:order-2">
          <div className="px-3 py-2 sm:px-4 sm:py-2.5 border-b border-slate-100 bg-slate-50 shrink-0 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-700">Vorschau</h3>
            <button
              type="button"
              onClick={() => {
                navigate("/order/edit");
              }}
              className="lg:hidden rounded-lg border border-primary-300 text-primary-700 px-[12px] py-[6px] text-sm font-semibold hover:bg-primary-50 hover:border-primary-400 transition-colors active:scale-[0.99] inline-flex items-center gap-2"
            >
              Bestellung prüfen
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <PreviewList
              orderItems={currentOrder.orderItems}
              items={items}
              categories={categories}
              onChangeCount={updateOrderItemCount}
            />
          </div>
        </aside>
      </div>
      <div className="hidden lg:block w-full overflow-x-hidden h-[140px] overflow-y-hidden px-3 pb-3">
        <div className="h-full bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 shrink-0">
            <h3 className="text-sm font-semibold text-slate-700">Kategorien</h3>
          </div>
          <div className="flex-1 overflow-x-hidden">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default OrderMain;
