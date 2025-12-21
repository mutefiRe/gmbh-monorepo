import { Area, Category, Item, Order, Table, Unit, User, Printer, Event } from '../../types';
import {
  initialItems, initialUsers, initialAreas,
  initialTables, initialCategories, initialOrders, initialUnits, initialPrinters
} from './mockData';

const BASE_URL = window.location.origin; // Adjust if your real backend is elsewhere
const API_BASE = 'api/';
const EVENT_STORAGE_KEY = 'gmbh-admin-event-id';
const MOCK_DELAY = 600;
const USE_MOCK = false; // Set to false to try real backend

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get token
const getToken = () => localStorage.getItem('gmbh-admin-auth-jwt');
const getEventId = () => localStorage.getItem(EVENT_STORAGE_KEY);
const setEventId = (eventId: string | null) => {
  if (eventId) {
    localStorage.setItem(EVENT_STORAGE_KEY, eventId);
  } else {
    localStorage.removeItem(EVENT_STORAGE_KEY);
  }
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeItemForApi = (item: Partial<Item>) => ({
  ...item,
  amount: toNumber(item.amount),
  price: toNumber(item.price),
  tax: toNumber(item.tax),
});

// Generic Fetch Wrapper
async function client<T>(endpoint: string, { body, ...customConfig }: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['x-access-token'] = token;
  }
  const eventId = getEventId();
  if (eventId) {
    headers['x-event-id'] = eventId;
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
    const errorText = await response.text();
    let errorMsg = errorText;
    try {
      const parsed = JSON.parse(errorText);
      errorMsg = parsed?.errors?.msg || errorText;
    } catch (_) {
      // keep raw text
    }
    if (token && (response.status === 401 || response.status === 403)) {
      localStorage.removeItem('gmbh-admin-auth-jwt');
      window.location.reload();
    }
    if (token && response.status === 400 && (errorMsg === 'auth.tokenError' || errorMsg === 'auth.eventChanged')) {
      localStorage.removeItem('gmbh-admin-auth-jwt');
      window.location.reload();
    }
    throw new Error(errorMsg || 'Network Error');
  }
  return response.json();
}

// --- API Methods ---

export const api = {
  getEventId,
  setEventId,
  getEvents: async (): Promise<{ events: Event[]; activeEventId: string | null }> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return { events: [], activeEventId: null }; }
    return client<{ events: Event[]; activeEventId: string | null }>(API_BASE + 'events', {
      headers: { 'x-event-id': '' }
    });
  },
  createEvent: async (payload: Partial<Event> & {
    importFromEventId?: string;
    include?: {
      units?: boolean;
      categories?: boolean;
      items?: boolean;
      areas?: boolean;
      tables?: boolean;
    };
  }): Promise<Event> => {
    if (USE_MOCK) {
      await delay(MOCK_DELAY);
      return { ...payload, id: Date.now().toString() } as Event;
    }
    const { importFromEventId, include, ...event } = payload;
    return (
      await client<{ event: Event }>(API_BASE + 'events', {
        method: 'POST',
        body: { event, importFromEventId, include } as any
      })
    ).event;
  },
  deleteEvent: async (eventId: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(MOCK_DELAY);
      return;
    }
    await client(`${API_BASE}events/${eventId}`, { method: 'DELETE' });
  },
  setActiveEvent: async (eventId: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(MOCK_DELAY);
      return;
    }
    await client<{ setting: unknown }>(API_BASE + 'settings', {
      method: 'PUT',
      body: { setting: { activeEventId: eventId } } as any
    });
  },
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
    const items = (await client<{ items: Item[] }>(API_BASE + 'items')).items;
    return items.map((item) => ({
      ...item,
      amount: toNumber(item.amount),
      price: toNumber(item.price),
      tax: toNumber(item.tax),
    }));
  },
  createItem: async (item: Partial<Item>): Promise<Item> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return { ...item, id: Date.now().toLocaleString() } as Item; }
    return (await client<{ item: Item }>(API_BASE + 'items', { body: { item: normalizeItemForApi(item) } as any })).item;
  },
  updateItem: async (item: Item): Promise<Item> => {
    if (USE_MOCK) { await delay(MOCK_DELAY); return item; }
    return (await client<{ item: Item }>(`${API_BASE}items/${item.id}`, { method: 'PUT', body: { item: normalizeItemForApi(item) } as any })).item;
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
  getOrders: async (params?: { skip?: number; limit?: number }): Promise<{ orders: Order[]; count: number; total: number }> => {
    if (USE_MOCK) {
      await delay(MOCK_DELAY);
      const allOrders = [...initialOrders];
      const skip = params?.skip ?? 0;
      const limit = params?.limit;
      const pagedOrders = typeof limit === 'number' ? allOrders.slice(skip, skip + limit) : allOrders.slice(skip);
      return { orders: pagedOrders, count: pagedOrders.length, total: allOrders.length };
    }
    const query = new URLSearchParams();
    if (typeof params?.skip === 'number') query.set('skip', String(params.skip));
    if (typeof params?.limit === 'number') query.set('limit', String(params.limit));
    const queryString = query.toString();
    return client<{ orders: Order[]; count: number; total: number }>(`${API_BASE}orders${queryString ? `?${queryString}` : ''}`);
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
  },

  getStats: async (): Promise<{
    totalRevenue: number;
    ordersCount: number;
    activeTables: number;
    averageOrderValue: number;
    salesByDay: { date: string; sales: number }[];
    recentOrders: { id: string; number: number; total: number; tableName: string }[];
  }> => {
    if (USE_MOCK) {
      await delay(MOCK_DELAY);
      return {
        totalRevenue: 0,
        ordersCount: 0,
        activeTables: 0,
        averageOrderValue: 0,
        salesByDay: [],
        recentOrders: []
      };
    }
    return client(`${API_BASE}stats`);
  }
};
