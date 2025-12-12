import { Area, Category, Item, Order, Table, Unit, User, Printer } from '../../types';

// Mock Data
export const initialUsers: User[] = [
  { id: "1", username: 'admin', firstname: 'Daniel', lastname: 'Manager', role: 'admin' },
  { id: "2", username: 'kellner1', firstname: 'Sarah', lastname: 'Service', role: 'waiter', areas: ["1"] },
  { id: "3", username: 'kellner2', firstname: 'Mike', lastname: 'Runner', role: 'waiter', areas: ["2"] },
];

export const initialAreas: Area[] = [
  { id: '1', name: 'Hauptsaal', short: 'HS', enabled: true },
  { id: '2', name: 'Terrasse', short: 'TR', enabled: true },
  { id: '3', name: 'Bar', short: 'BR', enabled: false },
];

export const initialTables: Table[] = [
  { id: "101", areaId: '1', name: 'Tisch 1', enabled: true },
  { id: "102", areaId: '1', name: 'Tisch 2', enabled: true },
  { id: "201", areaId: '2', name: 'Terrasse 1', enabled: true },
  { id: "202", areaId: '2', name: 'Terrasse 2', enabled: true },
];

export const initialCategories: Category[] = [
  { id: 1, name: 'Getränke', enabled: true, icon: 'beer' },
  { id: 2, name: 'Vorspeisen', enabled: true, icon: 'salad' },
  { id: 3, name: 'Hauptspeisen', enabled: true, icon: 'utensils' },
  { id: 4, name: 'Desserts', enabled: true, icon: 'ice-cream' },
];

export const initialUnits: Unit[] = [
  { id: "1", name: 'Stk.' },
  { id: "2", name: 'l' },
  { id: "3", name: 'kg' },
];

export const initialPrinters: Printer[] = [
  { id: "1", name: 'Küche', systemName: '192.168.1.200' },
  { id: "2", name: 'Theke', systemName: '192.168.1.201' },
];

export const initialItems: Item[] = [
  { id: "1", name: 'Cola', price: 3.50, tax: 19, categoryId: "1", unitId: "2", enabled: true },
  { id: "2", name: 'Bier', price: 4.50, tax: 19, categoryId: "1", unitId: "2", enabled: true },
  { id: "3", name: 'Caesar Salad', price: 12.00, tax: 7, categoryId: "2", unitId: "1", enabled: true },
  { id: "4", name: 'Rumpsteak', price: 28.00, tax: 7, categoryId: "3", unitId: "1", enabled: true },
  { id: "5", name: 'Vanilleeis', price: 6.50, tax: 7, categoryId: "4", unitId: "1", enabled: true },
];

export const initialOrders: Order[] = [
  {
    id: "5001",
    userId: "2",
    tableId: "101",
    totalAmount: 15.50,
    timestamp: new Date(),
    orderitems: [
      { id: "1", count: 2, price: 3.50, itemId: "1" },
      { id: "2", count: 1, price: 8.50, itemId: "3" } // assuming dynamic price or old price
    ]
  },
  {
    id: "5002",
    userId: "3",
    tableId: "201",
    totalAmount: 9.00,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    orderitems: [
      { id: "3", count: 2, price: 4.50, itemId: "2" }
    ]
  }
];