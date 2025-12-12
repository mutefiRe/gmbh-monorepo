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
  tax: number;
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
  orderId: string;
}

export interface Order {
  id: string;
  totalAmount: number;
  userId: string;
  tableId: string;
  orderitems: OrderItem[];
}

export interface Printer {
  id: string;
  systemName: string;
  name: string;
}

export interface Setting {
  id: string;
  name: string;
  beginDate: string | Date;
  endDate: string | Date;
  instantPay: boolean;
  customTables: boolean;
  receiptPrinter: string;
  expiresTime: string;
  itemShowPrice: boolean;
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
  printer: string;
  areaIds: string[];
  password?: string;
}