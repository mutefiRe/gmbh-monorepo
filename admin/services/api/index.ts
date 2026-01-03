import { Area, Category, Item, Order, Table, Unit, User, Printer, Event, UpdateStatusResponse, UpdatePullResponse } from '../../types';

const BASE_URL = window.location.origin; // Adjust if your real backend is elsewhere
const API_BASE = 'api/';
const EVENT_STORAGE_KEY = 'gmbh-admin-event-id';
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
    const { importFromEventId, include, ...event } = payload;
    return (
      await client<{ event: Event }>(API_BASE + 'events', {
        method: 'POST',
        body: { event, importFromEventId, include } as any
      })
    ).event;
  },
  updateEvent: async (eventId: string, event: Partial<Event>): Promise<Event> => {
    return (await client<{ event: Event }>(`${API_BASE}events/${eventId}`, {
      method: 'PUT',
      body: { event } as any
    })).event;
  },
  deleteEvent: async (eventId: string): Promise<void> => {
    await client(`${API_BASE}events/${eventId}`, { method: 'DELETE' });
  },
  setActiveEvent: async (eventId: string): Promise<void> => {
    await client<{ setting: unknown }>(API_BASE + 'settings', {
      method: 'PUT',
      body: { setting: { activeEventId: eventId } } as any
    });
  },
  getStatus: async (): Promise<{ status: string; api?: { ok: boolean }; printerApi?: { ok: boolean; error?: string }; activeWindowMinutes?: number; activeUsers?: Array<{ id: string; username: string; role?: string; lastSeen: number }> }> => {
    return client(`${API_BASE}status`);
  },
  getStatusOrders: async (windowMinutes = 15, bucketSeconds = 60): Promise<{ windowMinutes: number; bucketSeconds: number; points: Array<{ ts: number; count: number }> }> => {
    const params = new URLSearchParams({ windowMinutes: String(windowMinutes), bucketSeconds: String(bucketSeconds) });
    return client(`${API_BASE}status/orders?${params.toString()}`);
  },
  getUpdateStatus: async (): Promise<UpdateStatusResponse> => {
    return client<UpdateStatusResponse>(`${API_BASE}update`);
  },
  pullUpdate: async (serviceId: string, tag?: string): Promise<UpdatePullResponse> => {
    return client<UpdatePullResponse>(`${API_BASE}update/${serviceId}/pull`, {
      method: 'POST',
      body: tag ? { tag } : undefined
    });
  },
  login: async (username: string, password: string): Promise<{ token: string }> => {
    return client('authenticate', { body: { username, password } as any });
  },

  // --- Items ---
  getItems: async (): Promise<Item[]> => {
    const items = (await client<{ items: Item[] }>(API_BASE + 'items')).items;
    return items.map((item) => ({
      ...item,
      amount: toNumber(item.amount),
      price: toNumber(item.price),
    }));
  },
  createItem: async (item: Partial<Item>): Promise<Item> => {
    return (await client<{ item: Item }>(API_BASE + 'items', { body: { item: normalizeItemForApi(item) } as any })).item;
  },
  updateItem: async (item: Item): Promise<Item> => {
    return (await client<{ item: Item }>(`${API_BASE}items/${item.id}`, { method: 'PUT', body: { item: normalizeItemForApi(item) } as any })).item;
  },
  deleteItem: async (id: number): Promise<void> => {
    return client(`${API_BASE}items/${id}`, { method: 'DELETE' });
  },

  // --- Users ---
  getUsers: async (): Promise<User[]> => {
    return (await client<{ users: User[] }>(API_BASE + 'users')).users;
  },
  createUser: async (user: Partial<User>): Promise<User> => {
    return (await client<{ user: User }>(API_BASE + 'users', { body: { user: user } as any })).user;
  },
  updateUser: async (user: User): Promise<User> => {
    return (await client<{ user: User }>(`${API_BASE}users/${user.id}`, { method: 'PUT', body: { user: user } as any })).user;
  },
  deleteUser: async (id: number): Promise<void> => {
    return client(`${API_BASE}users/${id}`, { method: 'DELETE' });
  },

  // --- Areas ---
  getAreas: async (): Promise<Area[]> => {
    return (await client<{ areas: Area[] }>(API_BASE + 'areas')).areas;
  },
  createArea: async (area: Partial<Area>): Promise<Area> => {
    return (await client<{ area: Area }>(API_BASE + 'areas', { body: { area: area } as any })).area;
  },
  updateArea: async (area: Area): Promise<Area> => {
    return (await client<{ area: Area }>(`${API_BASE}areas/${area.id}`, { method: 'PUT', body: { area: area } as any })).area;
  },
  deleteArea: async (id: string): Promise<void> => {
    return client(`${API_BASE}areas/${id}`, { method: 'DELETE' });
  },

  // --- Tables ---
  getTables: async (): Promise<Table[]> => {
    return (await client<{ tables: Table[] }>(API_BASE + 'tables')).tables;
  },
  createTable: async (table: Partial<Table>): Promise<Table> => {
    const payload = { ...table } as any;
    if (payload.x === null || payload.x === undefined || payload.x === '') delete payload.x;
    if (payload.y === null || payload.y === undefined || payload.y === '') delete payload.y;
    if (typeof payload.x === 'string') {
      const parsed = Number(payload.x);
      if (Number.isNaN(parsed)) delete payload.x;
      else payload.x = parsed;
    }
    if (typeof payload.y === 'string') {
      const parsed = Number(payload.y);
      if (Number.isNaN(parsed)) delete payload.y;
      else payload.y = parsed;
    }
    return (await client<{ table: Table }>(API_BASE + 'tables', { body: { table: payload } as any })).table;
  },
  deleteTable: async (id: number): Promise<void> => {
    return client(`${API_BASE}tables/${id}`, { method: 'DELETE' });
  },
  updateTable: async (table: Table): Promise<Table> => {
    const payload = { ...table } as any;
    if (payload.x === null || payload.x === undefined || payload.x === '') delete payload.x;
    if (payload.y === null || payload.y === undefined || payload.y === '') delete payload.y;
    if (typeof payload.x === 'string') {
      const parsed = Number(payload.x);
      if (Number.isNaN(parsed)) delete payload.x;
      else payload.x = parsed;
    }
    if (typeof payload.y === 'string') {
      const parsed = Number(payload.y);
      if (Number.isNaN(parsed)) delete payload.y;
      else payload.y = parsed;
    }
    return (await client<{ table: Table }>(`${API_BASE}tables/${table.id}`, { method: 'PUT', body: { table: payload } as any })).table;
  },

  // --- Orders ---
  getOrders: async (params?: { skip?: number; limit?: number }): Promise<{ orders: Order[]; count: number; total: number }> => {
    const query = new URLSearchParams();
    if (typeof params?.skip === 'number') query.set('skip', String(params.skip));
    if (typeof params?.limit === 'number') query.set('limit', String(params.limit));
    const queryString = query.toString();
    return client<{ orders: Order[]; count: number; total: number }>(`${API_BASE}orders${queryString ? `?${queryString}` : ''}`);
  },

  // --- Categories ---
  getCategories: async (): Promise<Category[]> => {
    return (await client<{ categories: Category[] }>(API_BASE + 'categories')).categories;
  },
  createCategory: async (category: Partial<Category>): Promise<Category> => {
    return (await client<{ category: Category }>(API_BASE + 'categories', { body: { category: category } as any })).category;
  },
  updateCategory: async (category: Category): Promise<Category> => {
    return (await client<{ category: Category }>(`${API_BASE}categories/${category.id}`, { method: 'PUT', body: { category } as any })).category;
  },
  deleteCategory: async (id: number): Promise<void> => {
    return client(`${API_BASE}categories/${id}`, { method: 'DELETE' });
  },

  // --- Units ---
  getUnits: async (): Promise<Unit[]> => {
    return (await client<{ units: Unit[] }>(API_BASE + 'units')).units;
  },
  createUnit: async (unit: Partial<Unit>): Promise<Unit> => {
    return (await client<{ unit: Unit }>(API_BASE + 'units', { body: { unit: unit } as any })).unit;
  },
  updateUnit: async (unit: Unit): Promise<Unit> => {
    return (await client<{ unit: Unit }>(`${API_BASE}units/${unit.id}`, { method: 'PUT', body: { unit: unit } as any })).unit;
  },
  deleteUnit: async (id: number): Promise<void> => {
    return client(`${API_BASE}units/${id}`, { method: 'DELETE' });
  },

  // --- Printers ---
  getPrinters: async (): Promise<Printer[]> => {
    return (await client<{ printers: Printer[] }>(`${API_BASE}printers?includeDetails=true&includeQueue=true`)).printers;
  },
  getPrintersStatus: async (): Promise<Printer[]> => {
    return (await client<{ printers: Printer[] }>(`${API_BASE}printers?includeDetails=false&includeQueue=false`)).printers;
  },
  getPrintersQueueStatus: async (): Promise<Printer[]> => {
    return (await client<{ printers: Printer[] }>(`${API_BASE}printers?includeDetails=false&includeQueue=true`)).printers;
  },
  createPrinter: async (printer: Partial<Printer>): Promise<Printer> => {
    return (await client<{ printer: Printer }>(API_BASE + 'printers', { body: { printer: printer } as any })).printer;
  },
  updatePrinter: async (printer: Printer): Promise<Printer> => {
    return (await client<{ printer: Printer }>(`${API_BASE}printers/${printer.id}`, { method: 'PUT', body: { printer: printer } as any })).printer;
  },
  deletePrinter: async (id: number): Promise<void> => {
    return client(`${API_BASE}printers/${id}`, { method: 'DELETE' });
  },
  scanPrinters: async (): Promise<{ ok: string }> => {
    return client(`${API_BASE}printers/update`, { method: 'POST' });
  },

  getStatsSummary: async (): Promise<{
    totalRevenue: number;
    ordersCount: number;
    activeTables: number;
    averageOrderValue: number;
  }> => {
    return client(`${API_BASE}stats/summary`);
  },
  getStatsSalesHalfHour: async (): Promise<{ data: { buckets: { ts: string; total: number; paid: number }[] } }> => {
    return client(`${API_BASE}stats/sales-by-half-hour`);
  },
  getStatsRecentOrders: async (limit = 5): Promise<{ recentOrders: { id: string; number: number; total: number; tableName: string }[] }> => {
    const params = new URLSearchParams({ limit: String(limit) });
    return client(`${API_BASE}stats/recent-orders?${params.toString()}`);
  },
  getStatsTopItems: async (limit = 15): Promise<{ items: { name: string; amount: number; revenue: number }[] }> => {
    const params = new URLSearchParams({ limit: String(limit) });
    return client(`${API_BASE}stats/top-items?${params.toString()}`);
  }
};
