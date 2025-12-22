import { Redirect, Route, Switch } from "wouter";
import OrderMain from "./components/order-main";
import { OrderDetail } from "./components/order-detail";
import { useAreas, useCategories, useItems, useTables, useUnits } from "./types/queries";
import { useCallback, useEffect, useMemo } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useFontScale } from "./hooks/useFontScale";
import type { OrderItem } from "./types/models";
import { CURRENT_ORDER_KEY, type CurrentOrder } from "./types/state";
import { OrderHistory } from "./components/order-history";
import { PayDetail } from "./components/pay-main";
import { Settings } from "./components/settings";
import { Intro } from "./components/intro";
import { Notifications } from "./components/notifications";
import { LoadingScreen } from "./ui/loading-screen";
import { useConnectionStatus } from "./context/ConnectionStatusContext";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./auth-wrapper";
import { flushOfflineOrders } from "./lib/offlineOrders";
import { flushOfflinePayments } from "./lib/offlinePayments";
import { useRealtimeUpdates } from "./hooks/useRealtimeUpdates";
import { useOfflineOrderQueue } from "./hooks/useOfflineOrderQueue";

const uniqueById = <T extends { id: string | number }>(items: T[]) => {
  const seen = new Set<string | number>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

export function StateWrapper() {
  const auth = useAuth();
  const connection = useConnectionStatus();
  const { pendingOrders, pendingPayments } = useOfflineOrderQueue();
  useRealtimeUpdates();
  const canReachServer = connection.canReachServer;
  const queryCategories = useCategories({ enabled: canReachServer });
  const queryItems = useItems({ enabled: canReachServer });
  const unitsQuery = useUnits({ enabled: canReachServer });
  const areasQuery = useAreas({ enabled: canReachServer });
  const tablesQuery = useTables({ enabled: canReachServer });
  const queryClient = useQueryClient();
  const [fontScale, setFontScale] = useFontScale();

  const [currentOrder, setCurrentOrder] = useLocalStorage<CurrentOrder>(CURRENT_ORDER_KEY, { orderItems: [], tableId: null, customTableName: null, printId: "" });
  const [orderItems, setOrderItems] = useMemo(() => [currentOrder.orderItems, (orderItems: OrderItem[]) => {
    setCurrentOrder({ ...currentOrder, orderItems });
  }], [currentOrder, setCurrentOrder]);

  const categories = queryCategories.data?.categories || [];
  const units = unitsQuery.data?.units || [];
  const areas = areasQuery.data?.areas || [];
  const tables = tablesQuery.data?.tables || [];

  // Sort categories by name
  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );
  const sortedItems = useMemo(
    () => [...queryItems.data?.items || []].sort((a, b) => a.name.localeCompare(b.name)),
    [queryItems.data]
  );

  const sortedTables = useMemo(
    () => [...tables].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })),
    [tables]
  );

  const sortedAreas = useMemo(
    () => [...areas].sort((a, b) => a.name.localeCompare(b.name)),
    [areas]
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

  const isBootstrapping = canReachServer && (
    queryCategories.isLoading
    || queryItems.isLoading
    || unitsQuery.isLoading
    || areasQuery.isLoading
    || tablesQuery.isLoading
  );

  const hasCachedData = Boolean(
    queryCategories.data
    && queryItems.data
    && unitsQuery.data
    && areasQuery.data
    && tablesQuery.data
  );

  const cacheScope = `${auth.userId || "anon"}:${auth.eventId || "none"}`;
  const cacheKey = (key: string) => `gmbh-waiter-cache:${cacheScope}:${key}`;
  const CACHE_TTL_MS = 1000 * 60 * 30;
  useEffect(() => {
    const restore = (key: string, queryKey: string[], wrap: (data: any) => any) => {
      if (queryClient.getQueryData(queryKey)) {
        return;
      }
      const raw = localStorage.getItem(cacheKey(key));
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (!parsed?.ts || Date.now() - parsed.ts > CACHE_TTL_MS) return;
        queryClient.setQueryData(queryKey, wrap(parsed.data));
      } catch (_) {
        // ignore cache parse errors
      }
    };
    restore("categories", ["categories"], (data) => ({ categories: uniqueById(data || []) }));
    restore("items", ["items"], (data) => ({ items: uniqueById(data || []) }));
    restore("units", ["units"], (data) => ({ units: uniqueById(data || []) }));
    restore("areas", ["areas"], (data) => ({ areas: uniqueById(data || []) }));
    restore("tables", ["tables"], (data) => ({ tables: uniqueById(data || []) }));
  }, [cacheScope, queryClient]);

  useEffect(() => {
    if (!canReachServer) return;
    const save = (key: string, data: any) => {
      localStorage.setItem(cacheKey(key), JSON.stringify({ ts: Date.now(), data }));
    };
    if (queryCategories.data) save("categories", queryCategories.data.categories);
    if (queryItems.data) save("items", queryItems.data.items);
    if (unitsQuery.data) save("units", unitsQuery.data.units);
    if (areasQuery.data) save("areas", areasQuery.data.areas);
    if (tablesQuery.data) save("tables", tablesQuery.data.tables);
  }, [
    cacheScope,
    canReachServer,
    queryCategories.data,
    queryItems.data,
    unitsQuery.data,
    areasQuery.data,
    tablesQuery.data
  ]);

  useEffect(() => {
    if (!canReachServer) return;
    const scope = { userId: auth.userId ?? null, eventId: auth.eventId ?? null };
    flushOfflineOrders(scope);
    flushOfflinePayments(scope);
  }, [auth.eventId, auth.userId, canReachServer]);

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  if (!canReachServer && !hasCachedData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-600 shadow-sm">
          Offline – keine lokalen Daten vorhanden.
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/order/new" >
        <OrderMain
          categories={sortedCategories}
          items={sortedItems}
          units={units}
          addItemToOrder={addItemToOrderCallback}
          updateOrderItemCount={updateOrderItemCountCallback}
          currentOrder={currentOrder}
          canReachServer={canReachServer}
          pendingOrders={pendingOrders}
          pendingPayments={pendingPayments}
        />
      </Route>
      <Route path="/order/edit" >
        <OrderDetail categories={sortedCategories} items={sortedItems} units={units} currentOrder={currentOrder} updateOrderItemCount={updateOrderItemCountCallback} setCurrentOrder={setCurrentOrder} areas={sortedAreas} tables={sortedTables} />
      </Route>
      <Route path="/orders">
        <OrderHistory />
      </Route>
      <Route path="/user/:userId/orders">
        {(params) => <div>All orders made from a specific user {params?.userId}</div>}
      </Route>
      <Route path="/orders/:orderId">
        {(params) => <PayDetail orderId={params?.orderId || ""} items={sortedItems} units={units} categories={sortedCategories} tables={tables} areas={areas} />}
      </Route>
      <Route path="/details">
        <div>Order Details Page</div>
      </Route>
      <Route path="/settings">
        <Settings fontScale={fontScale} onFontScaleChange={setFontScale} />
      </Route>
      <Route path="/notifications">
        <Notifications />
      </Route>
      <Route path="/intro">
        <Intro />
      </Route>

      <Redirect to="/order/new" />
      <Route>
        <div>404 Not Found</div>
      </Route>
    </Switch>
  );
}
