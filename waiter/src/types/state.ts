import type { OrderItem } from "./models";

export type CurrentOrder = {
  orderItems: OrderItem[];
  tableId: string | null;
}

export const CURRENT_ORDER_KEY = "currentOrder";