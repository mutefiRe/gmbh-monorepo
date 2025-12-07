import { Redirect, Route, Switch } from "wouter";
import OrderMain from "./components/order-main";
import { OrderDetail } from "./components/order-detail";
import { useCategories, useItems, useUnits } from "./types/queries";
import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { OrderItem } from "./types/models";
import { CURRENT_ORDER_KEY, type CurrentOrder } from "./types/state";
import { OrderHistory } from "./components/order-history";
import { PayDetail } from "./components/pay-main";



export function StateWrapper() {
  const queryCategories = useCategories();
  const queryItems = useItems();
  const unitsQuery = useUnits();

  const [currentOrder, setCurrentOrder] = useLocalStorage<CurrentOrder>(CURRENT_ORDER_KEY, { orderItems: [], tableId: null });
  const [orderItems, setOrderItems] = useMemo(() => [currentOrder.orderItems, (orderItems: OrderItem[]) => {
    setCurrentOrder({ ...currentOrder, orderItems });
  }], [currentOrder, setCurrentOrder]);

  const categories = queryCategories.data?.categories || [];
  const units = unitsQuery.data?.units || [];

  // Sort categories by name
  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );
  const sortedItems = useMemo(
    () => [...queryItems.data?.items || []].sort((a, b) => a.name.localeCompare(b.name)),
    [queryItems.data]
  );



  function addItemToOrder(item: OrderItem) {
    const existingItem = orderItems.find(oi => oi.itemId === item.itemId && oi.extras === item.extras);
    if (existingItem) {
      // If the item with the same extras exists, increase the count
      const updatedOrder = orderItems.map(oi => {
        if (oi.itemId === item.itemId && oi.extras === item.extras) {
          return { ...oi, count: oi.count + item.count };
        }
        return oi;
      });
      setOrderItems(updatedOrder);
      return;
    }
    setOrderItems([...orderItems, item]);
  }
  const addItemToOrderCallback = useCallback(addItemToOrder, [setOrderItems, orderItems]);

  function updateOrderItemCount(orderitem: OrderItem, count: number) {
    console.log("Updating order item count", orderitem, count);
    const updatedOrder = orderItems.map(oi => {

      if (oi.itemId === orderitem.itemId && oi.extras === orderitem.extras) {
        console.log("Found matching order item", oi);
        return { ...oi, count: count };
      }
      return oi;
    }).filter(oi => oi.count > 0); // Remove items with count 0
    setOrderItems(updatedOrder);
  }

  const updateOrderItemCountCallback = useCallback(updateOrderItemCount, [setOrderItems, orderItems]);

  if (queryCategories.isLoading || queryItems.isLoading || unitsQuery.isLoading) {
    return <div>Lade...</div>;
  }

  return (
    <Switch>
      <Route path="/order/new" >
        <OrderMain categories={sortedCategories} items={sortedItems} units={units} addItemToOrder={addItemToOrderCallback} currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} />
      </Route>
      <Route path="/order/edit" >
        <OrderDetail categories={sortedCategories} items={sortedItems} units={units} currentOrder={currentOrder} updateOrderItemCount={updateOrderItemCountCallback} setCurrentOrder={setCurrentOrder} />
      </Route>
      <Route path="/orders">
        {(params) => <OrderHistory />}
      </Route>
      <Route path="/user/:userId/orders">
        {(params) => <div>All orders made from a specific user {params?.userId}</div>}
      </Route>
      <Route path="/orders/:orderId">
        {(params) => <PayDetail orderId={params?.orderId || ""} items={sortedItems} units={units} />}
      </Route>
      <Route path="/details">
        <div>Order Details Page</div>
      </Route>
      <Route path="/settings">
        <div>Settings Page</div>
      </Route>
      <Route path="/notifications">
        <div>Notifications Page</div>
      </Route>

      <Redirect to="/order/new" />
      <Route>
        <div>404 Not Found</div>
      </Route>
    </Switch>
  );
}