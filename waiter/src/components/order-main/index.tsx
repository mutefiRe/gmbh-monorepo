import React, { useMemo, useState } from "react";
import { CategoryList } from "./category-list";
import type { Category, Item, OrderItem, Unit } from "../../types/models";
import { ProductList } from "./product-list";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { PreviewList } from "./preview-list";
// import ProductMainContainer from "./product/MainContainer";
// import PreviewMainContainer from "./preview/MainContainer";

interface OrderMainProps {
  categories: Category[];
  units: Unit[];
  actualCategory: any;
  changeCategory: (cat: any) => void;
  items: Item[];
  orderItems: OrderItem[];
  settings: any;
  addItemToOrder: (item: any) => void;
  showModal: (modal: string) => void;
  goToOrderDetail: () => void;
  goToPayMain: () => void;
  children?: React.ReactNode;
}

export const OrderMain: React.FC<OrderMainProps> = ({
  categories,
  units,
  items,
  addItemToOrder,
  orderItems,
  // settings,
  // order,
  children,
}) => {


  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);


  return (<>
    {children}
    <div className="grid grid-rows-[1fr_auto] h-screen w-full overflow-x-hidden">
      <div className="grid grid-cols-10 w-full h-full overflow-x-hidden">
        <div className="col-span-7 h-full overflow-y-auto overflow-x-hidden">
          <ProductList
            items={items}
            selectedCategory={selectedCategory}
            categories={categories}
            addItemToOrder={addItemToOrder}
            units={units}
          />
        </div>
        <div className="col-span-3 pr-3 h-full overflow-y-auto overflow-x-hidden">
          <PreviewList
            orderItems={orderItems}
            items={items}
            categories={categories}
          />
        </div>
      </div>
      <div className="w-full overflow-x-hidden">
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>
    </div>
  </>
  )
};

export default OrderMain;