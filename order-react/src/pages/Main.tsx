import React from "react";
import CategoryMainContainer from "../components/order-main/category/MainContainer";
import ProductMainContainer from "../components/order-main/product/MainContainer";
import PreviewMainContainer from "../components/order-main/preview/MainContainer";

interface MainProps {
  children?: React.ReactNode;
  categories: any[];
  actualCategory: any;
  changeCategory: (cat: any) => void;
  items: any[];
  settings: any;
  addItemToOrder: (item: any) => void;
  showModal: (modal: string) => void;
  goToOrderDetail: () => void;
  goToPayMain: () => void;
  order: any;
}

const Main: React.FC<MainProps> = ({
  categories,
  actualCategory,
  changeCategory,
  items,
  settings,
  addItemToOrder,
  showModal,
  goToOrderDetail,
  goToPayMain,
  order,
  children,
}) => (
  <>
    {children}
    <CategoryMainContainer
      categories={categories}
      actualCategory={actualCategory}
      changeCategory={changeCategory}
    />
    <div className="item-and-preview">
      <ProductMainContainer
        category={actualCategory}
        categories={categories}
        items={items}
        settings={settings}
        addItemToOrder={addItemToOrder}
        showModal={showModal}
        goToOrderDetail={goToOrderDetail}
        goToPayMain={goToPayMain}
      />
      <PreviewMainContainer
        order={order}
        goToOrderDetail={goToOrderDetail}
        goToPayMain={goToPayMain}
      />
    </div>
  </>
);

export default Main;