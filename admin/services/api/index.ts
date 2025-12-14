import { Area, Category, Item, Order, Table, Unit, User, Printer } from '../../types';
import {
  initialItems, initialUsers, initialAreas,
  initialTables, initialCategories, initialOrders, initialUnits, initialPrinters
} from './mockData';

const BASE_URL = window.location.origin; // Adjust if your real backend is elsewhere
const API_BASE = 'api/';
const MOCK_DELAY = 600;
const USE_MOCK = false; // Set to false to try real backend

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get token
const getToken = () => localStorage.getItem('gmbh-admin-auth-jwt');

// Generic Fetch Wrapper
async function client<T>(endpoint: string, { body, ...customConfig }: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['x-access-token'] = token;
  }

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}/${endpoint}`, config);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Network Error');
  }
  return response.json();
}

// --- API Methods ---

export const api = {
  login: async (username: string, password: string): Promise<{ token: string }> => {
    if (USE_MOCK) {
      await delay(800);
      if (username === 'admin' && password === 'admin') return { token: 'mock-jwt-token-12345' };
      if (username === 'waiter' && password === 'waiter') return { token: 'mock-jwt-token-waiter' };
      throw new Error('Ungültiger Benutzername oder Passwort');
    }
    return client('authenticate', { body: { username, password } as any });
  },

  // --- Items ---
  getItems: async (): Promise<Item[]> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return [...initialItems]; }
    return (await client<{ items: Item[] }>(API_BASE + 'items')).items;
  },
  createItem: async (item: Partial<Item>): Promise<Item> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return { ...item, id: Date.now().toLocaleString() } as Item; }
    return (await client<{ item: Item }>(API_BASE + 'items', { body: { item: item } as any })).item;
  },
  updateItem: async (item: Item): Promise<Item> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return item; }
    return (await client<{ item: Item }>(`${API_BASE}items/${item.id}`, { method: 'PUT', body: { item: item } as any })).item;
  },
  deleteItem: async (id: number): Promise<void> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return; }
    return client(`${API_BASE}items/${id}`, { method: 'DELETE' });
  },

  // --- Users ---
  getUsers: async (): Promise<User[]> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return [...initialUsers]; }
    return (await client<{ users: User[] }>(API_BASE + 'users')).users;
  },
  createUser: async (user: Partial<User>): Promise<User> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return { ...user, id: Date.now().toLocaleString() } as User; }
    return (await client<{ user: User }>(API_BASE + 'users', { body: { user: user } as any })).user;
  },
  updateUser: async (user: User): Promise<User> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return user; }
    return (await client<{ user: User }>(`${API_BASE}users/${user.id}`, { method: 'PUT', body: { user: user } as any })).user;
  },
  deleteUser: async (id: number): Promise<void> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return; }
    return client(`${API_BASE}users/${id}`, { method: 'DELETE' });
  },

  // --- Areas ---
  getAreas: async (): Promise<Area[]> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return [...initialAreas]; }
    return (await client<{ areas: Area[] }>(API_BASE + 'areas')).areas;
  },
  createArea: async (area: Partial<Area>): Promise<Area> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return { ...area, id: String(Date.now()) } as Area; }
    return (await client<{ area: Area }>(API_BASE + 'areas', { body: { area: area } as any })).area;
  },
  updateArea: async (area: Area): Promise<Area> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return area; }
    return (await client<{ area: Area }>(`${API_BASE}areas/${area.id}`, { method: 'PUT', body: { area: area } as any })).area;
  },
  deleteArea: async (id: string): Promise<void> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return; }
    return client(`${API_BASE}areas/${id}`, { method: 'DELETE' });
  },

  // --- Tables ---
  getTables: async (): Promise<Table[]> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return [...initialTables]; }
    return (await client<{ tables: Table[] }>(API_BASE + 'tables')).tables;
  },
  createTable: async (table: Partial<Table>): Promise<Table> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return { ...table, id: Date.now().toLocaleString() } as Table; }
    return (await client<{ table: Table }>(API_BASE + 'tables', { body: { table: table } as any })).table;
  },
  deleteTable: async (id: number): Promise<void> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return; }
    return client(`${API_BASE}tables/${id}`, { method: 'DELETE' });
  },
  updateTable: async (table: Table): Promise<Table> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return table; }
    return (await client<{ table: Table }>(`${API_BASE}tables/${table.id}`, { method: 'PUT', body: { table: table } as any })).table;
  },

  // --- Orders ---
  getOrders: async (): Promise<Order[]> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return [...initialOrders]; }
    return (await client<{ orders: Order[] }>(API_BASE + 'orders')).orders;
  },

  // --- Categories ---
  getCategories: async (): Promise<Category[]> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return [...initialCategories]; }
    return (await client<{ categories: Category[] }>(API_BASE + 'categories')).categories;
  },
  createCategory: async (category: Partial<Category>): Promise<Category> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return { ...category, id: Date.now() } as Category; }
    return (await client<{ category: Category }>(API_BASE + 'categories', { body: { category: category } as any })).category;
  },
  updateCategory: async (category: Category): Promise<Category> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return category; }
    return (await client<{ category: Category }>(`${API_BASE}categories/${category.id}`, { method: 'PUT', body: { category } as any })).category;
  },
  deleteCategory: async (id: number): Promise<void> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return; }
    return client(`${API_BASE}categories/${id}`, { method: 'DELETE' });
  },

  // --- Units ---
  getUnits: async (): Promise<Unit[]> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return [...initialUnits]; }
    return (await client<{ units: Unit[] }>(API_BASE + 'units')).units;
  },
  createUnit: async (unit: Partial<Unit>): Promise<Unit> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return { ...unit, id: Date.now().toLocaleString() } as Unit; }
    return (await client<{ unit: Unit }>(API_BASE + 'units', { body: { unit: unit } as any })).unit;
  },
  updateUnit: async (unit: Unit): Promise<Unit> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return unit; }
    return (await client<{ unit: Unit }>(`${API_BASE}units/${unit.id}`, { method: 'PUT', body: { unit: unit } as any })).unit;
  },
  deleteUnit: async (id: number): Promise<void> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return; }
    return client(`${API_BASE}units/${id}`, { method: 'DELETE' });
  },

  // --- Printers ---
  getPrinters: async (): Promise<Printer[]> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return [...initialPrinters]; }
    return (await client<{ printers: Printer[] }>(API_BASE + 'printers')).printers;
  },
  createPrinter: async (printer: Partial<Printer>): Promise<Printer> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return { ...printer, id: Date.now().toLocaleString() } as Printer; }
    return (await client<{ printer: Printer }>(API_BASE + 'printers', { body: { printer: printer } as any })).printer;
  },
  updatePrinter: async (printer: Printer): Promise<Printer> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return printer; }
    return (await client<{ printer: Printer }>(`${API_BASE}printers/${printer.id}`, { method: 'PUT', body: { printer: printer } as any })).printer;
  },
  deletePrinter: async (id: number): Promise<void> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return; }
    return client(`${API_BASE}printers/${id}`, { method: 'DELETE' });
  },
  scanPrinters: async (): Promise<{ ok: string }> => {
    if (USE_MOCK) {
      await delay(2000); // Simulate network scan delay
      // Simulate finding a random printer
      const rnd = Math.floor(Math.random() * 255);
      initialPrinters.push({
        id: Date.now().toLocaleString(),
        name: `Netzwerkdrucker ${rnd}`,
        systemName: `192.168.1.${rnd}`
      });
      return { ok: 'true' };
    }
    return client(`${API_BASE}printers/update`, { method: 'POST' });
  }
};