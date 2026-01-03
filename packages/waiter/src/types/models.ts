export interface Area {
  id: string;
  name: string;
  short: string;
  enabled: boolean;
}

export interface Category {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  icon: string;
  showAmount: boolean;
  printer: string;
  parentCategory?: string;
  color: string;
  categories?: string[];
}

export interface Item {
  id: string;
  name: string;
  amount: string;
  price: number;
  sort: number;
  category: number;
  unitId: string;
  enabled: boolean;
  categoryId: string;
}

export interface Organization {
  id: string;
  uid: number;
  street: string;
  street_number: string;
  postalcode: string;
  city: string;
  telephone: string;
}

export interface OrderItem {
  id?: string;
  extras: string;
  count: number;
  countPaid: number;
  countFree: number;
  price: number;
  itemId: string;
  orderId?: string;
}

export interface Order {
  id: string;
  number?: string;
  createdAt?: string;
  totalAmount: number;
  userId: string;
  tableId: string | null;
  customTableName?: string | null;
  printCount: number;
  orderitems?: OrderItem[];
}

export interface Notification {
  id: string;
  eventId: string;
  entityType: string;
  entityId?: string | null;
  action: string;
  message: string;
  meta?: Record<string, unknown> | null;
  createdAt?: string;
}

export interface Printer {
  id: string;
  systemName: string;
  name: string;
}

export interface Event {
  id: string;
  name: string;
  beginDate: string | Date | null;
  endDate: string | Date | null;
  customTables: boolean;
}

export interface Setting {
  id: string;
  name: string;
  beginDate: string | Date;
  endDate: string | Date;
  instantPay: boolean;
  expiresTime: string;
  itemShowPrice: boolean;
  activeEvent?: Event | null;
}

export interface Table {
  id: string;
  areaId: string;
  name: string;
  x: number;
  y: number;
  custom: boolean;
  enabled: boolean;
}

export interface Unit {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  role: string;
  areaIds: string[];
  password?: string;
}
