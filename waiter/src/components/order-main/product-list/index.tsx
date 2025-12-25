
import { useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import type { Category, Item, OrderItem, Unit } from "../../../types/models";



import { Modal } from "../../../ui/modal";
import { getCategoryColor } from "../../../lib/colors";
import { itemAmountString } from "../../../lib/itemAmountString";
import { useExtrasHistory } from "../../../hooks/useExtrasHistory";
import { IconLabel } from "../../../ui/icon-label";

type ProductListProps = {
  items: Item[];
  selectedCategory: Category | null;
  categories: Category[];
  addItemToOrder: (item: OrderItem) => void;
  units: Unit[];
  orderItems: OrderItem[];
  gridDensity?: "standard" | "compact";
};

export function ProductList({
  items,
  selectedCategory,
  categories,
  addItemToOrder,
  units,
  orderItems,
  gridDensity = "standard"
}: ProductListProps) {

  const [modalItemId, setModalItemId] = useState<null | string>(null);
  const filteredItems = selectedCategory
    ? items.filter(item => item.categoryId === selectedCategory.id)
    : items;
  function toggleModal(newModalItemId: string | null) {
    setModalItemId(newModalItemId);
  }


  // In ProductList:
  const settings = { showItemPrice: true }; // Replace with actual settings
  const gridClassName = gridDensity === "compact"
    ? "grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <div className="w-full h-full min-h-0 product-scroll flex flex-col">
      <div className={`grid ${gridClassName} gap-2 p-2 flex-1 content-start`}>

        {filteredItems.map(item => (
          <ProductItem
            categories={categories}
            units={units}
            key={item.id}
            item={item}
            showItemPrice={settings.showItemPrice}
            addItemToOrder={addItemToOrder}
            setModalOpen={toggleModal}
            modalOpen={modalItemId === item.id.toString()}
            orderItems={orderItems}
          />
        ))}
      </div>
    </div>
  );
}
type ProductItemProps = {
  item: Item;
  units: Unit[];
  showItemPrice: boolean;
  addItemToOrder: (item: OrderItem) => void;
  setModalOpen: (modalItemId: string | null) => void;
  modalOpen: boolean;
  categories: Category[];
  orderItems: OrderItem[];
};

function ProductItem({ item, showItemPrice, addItemToOrder, setModalOpen, modalOpen, categories, units, orderItems }: ProductItemProps) {
  const [extras, setExtras] = useState<string>("");
  const unit = units.find(u => u.id === item.unitId);
  const [count, setCount] = useState<number>(1);
  const { getSuggestions } = useExtrasHistory();
  const suggestedExtras = getSuggestions(String(item.id));
  const isDisabled = item.enabled === false;


  const handleClick = () => {
    if (isDisabled) return;
    addItemToOrder({
      itemId: item.id,
      extras: extras,
      count: 1,
      countPaid: 0,
      countFree: 0,
      price: item.price
    });
  };


  const itemCategory = categories.find(cat => cat.id === item.categoryId);
  const categoryColor = itemCategory?.color || getCategoryColor(itemCategory).color;
  const { countInOrder, extrasCounts } = orderItems.reduce(
    (acc, orderItem) => {
      if (orderItem.itemId !== item.id) {
        return acc;
      }
      const count = orderItem.count ?? 1;
      acc.countInOrder += count;
      if (orderItem.extras) {
        const extrasKey = orderItem.extras.trim();
        acc.extrasCounts[extrasKey] = (acc.extrasCounts[extrasKey] || 0) + count;
      }
      return acc;
    },
    { countInOrder: 0, extrasCounts: {} as Record<string, number> }
  );
  const extrasBadges = Object.entries(extrasCounts).sort(([a], [b]) =>
    a.localeCompare(b, "de", { sensitivity: "base" })
  );


  const style = itemCategory
    ? {
      borderLeftColor: categoryColor
    }
    : {};

  let fontSize = "1rem";
  if (item.name.length > 20) {
    fontSize = "0.85rem";
  } else if (item.name.length > 15) {
    fontSize = "0.9rem";
  }

  return (
    <>
      <Modal
        actions={
          <button
            className="px-4 py-2 bg-primary rounded text-primary-contrast active:scale-90 transition-all duration-50 inline-flex items-center gap-2"
            onClick={(event) => {
              addItemToOrder({
                itemId: item.id,
                extras: extras,
                count: count,
                countPaid: 0,
                countFree: 0,
                price: item.price
              });
              setExtras("");
              setModalOpen(null);
              event?.preventDefault();
              event.stopPropagation();
            }}>
            <IconLabel icon={<Plus size={16} />} position="right">
              Hinzufügen
            </IconLabel>
          </button>
        }
        open={modalOpen}
        onClose={() => setModalOpen(null)}
        title={itemCategory?.showAmount ? `${item.name} ${itemAmountString(item.amount)}${unit?.name || ''}` : item.name}
        subtitle={showItemPrice ? `Preis: € ${item.price?.toFixed ? item.price.toFixed(2) : item.price}` : undefined}
      >
        <div>
          {suggestedExtras.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Wähle von letzten Extras
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedExtras.map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setExtras(suggestion)}
                    className="px-3 py-1.5 text-sm rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Bemerkung
            </label>
            <input
              type="text"
              placeholder="z. B. ohne Zwiebel"
              value={extras}
              className="w-full rounded-lg border border-primary-200 bg-primary-50/40 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
              autoFocus={false}
              onChange={(e) => {
                setExtras(e.target.value);
              }}
            />
          </div>
          <div className="mt-4 text-sm font-semibold text-slate-700">Wie viele möchtest du hinzufügen?</div>
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              className="h-9 w-12 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold"
              onClick={(e) => {
                setCount(Math.max(1, count - 5));
                e.stopPropagation();
              }}
            >
              -5
            </button>
            <button
              type="button"
              className="h-9 w-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold"
              onClick={(e) => {
                setCount(Math.max(1, count - 1));
                e.stopPropagation();
              }}
            >
              -1
            </button>
            <input
              type="number"
              placeholder="Anzahl"
              min={1}
              value={count}
              className="h-9 w-20 rounded-lg border border-slate-200 px-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
              onChange={(e) => {
                setCount(Number(e.target.value));
              }}
            />
            <button
              type="button"
              className="h-9 w-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold"
              onClick={(e) => {
                setCount(count + 1);
                e.stopPropagation();
              }}
            >
              +1
            </button>
            <button
              type="button"
              className="h-9 w-12 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold"
              onClick={(e) => {
                setCount(count + 5);
                e.stopPropagation();
              }}
            >
              +5
            </button>
          </div>


        </div>
      </Modal>
      <button
        className={`relative min-w-[100px] pb-2 pt-2 min-h-[100px] overflow-hidden transition-all duration-200 flex flex-col items-center justify-center rounded-lg border border-slate-200 border-l-4 bg-white shadow-sm ${isDisabled ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200' : 'hover:shadow-md hover:bg-slate-50 active:shadow-sm active:scale-95'}`}
        style={style}
        disabled={isDisabled}
        onClick={handleClick}
      >
        {countInOrder > 0 && (
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            <span
              className="min-w-[1.25rem] h-5 px-1 rounded-full text-[0.7rem] font-semibold text-white flex items-center justify-center shadow-sm"
              style={{ backgroundColor: categoryColor }}
            >
              {countInOrder}
            </span>
            {extrasBadges.map(([extras, count]) => (
              <span
                key={extras}
                title={extras}
                className="min-w-[1.25rem] h-5 px-1 rounded-full text-[0.7rem] font-semibold text-slate-700 bg-white/90 border border-slate-200 flex items-center justify-center shadow-sm"
              >
                {count}
              </span>
            ))}
          </div>
        )}
        <div className="text-center text-[0.95rem] flex flex-col items-center justify-center h-full text-slate-800">
          <strong
            style={{ fontSize }}
            className={`${isDisabled ? "line-through text-slate-500" : ""} whitespace-normal break-words`}
          >
            {item.name}
            {itemCategory?.showAmount && (
              <span className="text-[0.8rem] text-slate-500 ml-1">
                {itemAmountString(item.amount)}{unit?.name}
              </span>
            )}
          </strong>
          {showItemPrice && (
            <span className="text-xs font-medium text-slate-600">
              € {item.price?.toFixed ? item.price.toFixed(2) : item.price}
            </span>
          )}
        </div>
        <button
          type="button"
          className="absolute bottom-1.5 right-1.5 h-8 w-8 rounded-full border border-slate-200/70 bg-white/70 text-slate-700 hover:bg-white/90 flex items-center justify-center"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!isDisabled) {
              setModalOpen(item.id);
            }
          }}
        >
          <SlidersHorizontal size={16} />
        </button>
      </button>
    </>


  );
}
