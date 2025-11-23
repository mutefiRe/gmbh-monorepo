import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OrderItem {
  openAmount?: number;
  // Add other fields as needed
}

interface OrderItemContextType {
  orderItems: OrderItem[];
  setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  orderIsPaid: (order: OrderItem) => boolean;
}

const OrderItemContext = createContext<OrderItemContextType | undefined>(undefined);

function orderIsPaid(order: OrderItem): boolean {
  return !!order && (order.openAmount ?? 1) <= 0;
}

export function OrderItemProvider({ children }: { children: ReactNode }) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  return (
    <OrderItemContext.Provider value={{ orderItems, setOrderItems, orderIsPaid }}>
      {children}
    </OrderItemContext.Provider>
  );
}

export function useOrderItems() {
  const context = useContext(OrderItemContext);
  if (!context) throw new Error('useOrderItems must be used within an OrderItemProvider');
  return context;
}
