import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface OrderItem {
  price: number;
  count: number;
  countPaid: number;
  // Add other fields as needed
}

export interface Order {
  id: string | number;
  createdAt?: Date;
  updatedAt?: Date;
  number?: number;
  user?: any;
  table?: any;
  orderitems?: OrderItem[];
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  showNumber: (order: Order) => string;
  openAmount: (order: Order) => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

function showNumber(order: Order): string {
  return order.number?.toString() || 'Noch nicht abgesendet!';
}

function openAmount(order: Order): number {
  if (!order.orderitems) return 0;
  return order.orderitems.reduce((sum, item) => {
    return sum + item.price * (item.count - item.countPaid);
  }, 0);
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // TODO: Replace with real API call
    async function fetchOrders() {
      setLoading(true);
      // Example: const response = await fetch('/api/orders');
      // setOrders(await response.json());
      setOrders([]); // Placeholder
      setLoading(false);
    }
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading, setOrders, showNumber, openAmount }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
}
