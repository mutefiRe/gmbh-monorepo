export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  role: 'admin' | 'waiter';
  areas?: string[];
}

export interface Area {
  id: string; // The API doc says string for ID in some places, number in others. Sticking to string for flexibility or number based on context.
  name: string;
  short?: string;
  tables?: string[];
  enabled: boolean;
}

export interface Table {
  id?: string;
  areaId: string; // ID of the Area
  name: string;
  x?: number;
  y?: number;
  custom?: boolean;
  enabled: boolean;
}

export interface Category {
  id: number;
  name: string;
  enabled: boolean;
  description?: string;
  icon?: string;
  color?: string;
  printerId?: string | null;
}

export interface Unit {
  id: string;
  name: string;
}

export interface Printer {
  id: string;
  name: string;
  systemName: string;
}

export interface Event {
  id: string;
  name: string;
  beginDate?: string;
  endDate?: string;
  customTables?: boolean;
}

export interface Item {
  id: string;
  name: string;
  amount: number;
  price: number;
  categoryId: string; // Category ID
  unitId?: string; // Unit ID
  enabled: boolean;
  sort?: number;
  createdAt?: string;
}

export interface OrderItem {
  id: string;
  count: number;
  price: number;
  itemId: string; // Item ID
  name?: string; // Hydrated for UI
}

export interface Order {
  id: string;
  totalAmount: number;
  userId: string; // User ID
  tableId: string | null; // Table ID
  customTableName?: string | null;
  orderitems: OrderItem[];
  printCount: number;
  timestamp: Date;
}

// Stats for dashboard
export interface DashboardStats {
  totalRevenue: number;
  ordersCount: number;
  activeTables: number;
  averageOrderValue: number;
  salesByDay: { date: string; sales: number }[];
  recentOrders: { id: string; number: number; total: number; tableName: string }[];
}
