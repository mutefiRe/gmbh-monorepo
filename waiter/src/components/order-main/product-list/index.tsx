
import { useRef, useState } from "react";
import type { Category, Item, OrderItem, Unit } from "../../../types/models";

import { useLongPress, usePress } from '@react-aria/interactions'
import { mergeProps } from '@react-aria/utils';


import { Modal } from "../../../ui/modal";
import { getCategoryColor } from "../../../lib/colors";

type ProductListProps = {
  items: Item[];
  selectedCategory: Category | null;
  categories: Category[];
  addItemToOrder: (item: OrderItem) => void;
  units: Unit[];
};

export function ProductList({
  items,
  selectedCategory,
  categories,
  addItemToOrder,
  units
}: ProductListProps) {

  const [modalItemId, setModalItemId] = useState<null | string>(null);
  const filteredItems = selectedCategory
    ? items.filter(item => item.categoryId === selectedCategory.id)
    : items;
  function toggleModal(newModalItemId: string | null) {
    console.log("Toggling modal for item ID:", newModalItemId);
    setModalItemId(newModalItemId);
  }


  // In ProductList:
  const settings = { showItemPrice: true }; // Replace with actual settings

  return (
    <div className="w-full h-full">
      <div className="overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 p-2">

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
};

function ProductItem({ item, showItemPrice, addItemToOrder, setModalOpen, modalOpen, categories, units }: ProductItemProps) {
  const [extras, setExtras] = useState<string>("");
  const unit = units.find(u => u.id === item.unitId);
  const [count, setCount] = useState<number>(1);


  const { longPressProps } = useLongPress({
    threshold: 500,
    onLongPress: () => {
      setModalOpen(item.id);
    }
  })

  const { pressProps } = usePress({
    onPress: () => {
      addItemToOrder({
        itemId: item.id,
        extras: extras,
        count: 1,
        countPaid: 0,
        countFree: 0,
        price: item.price,
        order: 0,
        id: ""
      });
    }
  })


  const itemCategory = categories.find(cat => cat.id === item.categoryId);
  const categoryColors = getCategoryColor(itemCategory);


  const style = itemCategory
    ? {
      color: categoryColors.brightContrast,
      backgroundColor: categoryColors.bright,
      borderLeft: `5px solid ${categoryColors.color}`,
    }
    : {};

  let fontSize = 16;
  if (item.name.length > 20) {
    fontSize = 10;
  } else if (item.name.length > 15) {
    fontSize = 12;
  }

  return (
    <>
      <Modal
        actions={
          <button
            className="px-4 py-2 bg-primary rounded text-primary-contrast active:scale-90 transition-all duration-50"
            onClick={(event) => {
              addItemToOrder({
                itemId: item.id,
                extras: extras,
                count: count,
                countPaid: 0,
                countFree: 0,
                price: item.price,
                order: 0,
                id: ""
              });
              setExtras("");
              setModalOpen(null);
              event?.preventDefault();
              event.stopPropagation();
            }}>
            Hinzufügen
          </button>
        }
        open={modalOpen} onClose={() => setModalOpen(null)} title={item.name}>
        <div>
          {itemCategory?.showAmount && (
            <p>
              Amount: {item.amount} {unit?.name}
            </p>
          )}
          {showItemPrice && (
            <p>Price: € {item.price?.toFixed ? item.price.toFixed(2) : item.price}</p>
          )}

          <input type="text" placeholder="Extras"
            value={extras}
            className="border p-2 w-full mb-4" onChange={(e) => {
              setExtras(e.target.value);
              // Handle extras input change if needed
            }} />
          <div>Wie viele möchtest du hinzufügen?</div>
          <div className="flex items-center justify-center mt-2">
            <button className="px-3 py-1 mr-2 bg-gray-200 rounded" onClick={(e) => {
              setCount(Math.max(1, count - 1));
              e.stopPropagation();
            }}>-</button>
            <input type="number" placeholder="Anzahl" defaultValue={1} min={1} value={count}
              className="border p-2 w-full mb-4" onChange={(e) => {
                setCount(Number(e.target.value));
              }} />
            <button className="px-3 py-1 ml-2 bg-gray-200 rounded" onClick={(e) => {
              setCount(count + 1);
              e.stopPropagation();
            }}>+</button>

          </div>


        </div>
      </Modal>
      <button
        className="relative min-w-[100px] pb-2 pt-2 min-h-[100px] overflow-hidden transition-all duration-200 flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg active:shadow-sm active:scale-90"
        style={style}
        {...mergeProps(longPressProps, pressProps)}
      >

        <div
          className="text-center text-[16px] flex flex-col items-center justify-center h-full"
        >
          <strong style={{ fontSize }}>{item.name}</strong>
          {itemCategory?.showAmount && (
            <>
              {' '}{itemAmountString(item.amount)}{unit?.name}
            </>
          )}
          {showItemPrice && (
            <><br />€ {item.price?.toFixed ? item.price.toFixed(2) : item.price}</>
          )}
        </div>
      </button>
    </>


  );
}

function itemAmountString(amount: string) {
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) return amount;

  // Show up to 2 decimals, but trim unnecessary zeros
  if (Number.isInteger(parsedAmount)) return parsedAmount.toString();
  return parsedAmount.toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9]*)0$/, '$1');
}