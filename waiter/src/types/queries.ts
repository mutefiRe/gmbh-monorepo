import { useQuery, useMutation, type UseQueryOptions } from '@tanstack/react-query';
import type {
  Area,
  Category,
  Item,
  Organization,
  Order,
  OrderItem,
  Printer,
  Notification,
  Setting,
  Table,
  Unit,
  User
} from './models';

// should be same hostname and port as the frontend is served from
const API_BASE = '';

type QueryOptions<T> = Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>;

// Improved API client with error handling
export const apiFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const token = localStorage.getItem("gmbh-auth-jwt");
  if (token) {
    options = {
      ...options,
      headers: {
        ...(options?.headers || {}),
        'x-access-token': `${JSON.parse(token)}`,
        ['Content-Type']: 'application/json',
      },
    };
  }
  const res = await fetch(API_BASE + url, {
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    const rawText = await res.text();
    let errorMsg = rawText;
    try {
      const parsed = JSON.parse(rawText);
      errorMsg = parsed?.errors?.msg || rawText;
    } catch (_) {
      // keep raw text
    }
    if (!url.startsWith('/authenticate') && (res.status === 401 || res.status === 403)) {
      const detail = {
        status: res.status,
        code: errorMsg,
        message: typeof errorMsg === 'string' ? errorMsg : String(errorMsg)
      };
      window.dispatchEvent(new CustomEvent('gmbh-auth-error', { detail }));
    }
    throw new Error(errorMsg);
  }
  return res.json();
};

// Query hooks for GET endpoints
export const useAreas = (options?: QueryOptions<{ areas: Area[] }>) =>
  useQuery<{ areas: Area[] }>({
    queryKey: ['areas'],
    queryFn: () => apiFetch<{ areas: Area[] }>('/api/areas'),
    ...options
  });
export const useArea = (id: string) => useQuery<Area>({ queryKey: ['area', id], queryFn: () => apiFetch<Area>(`/api/areas/${id}`) });

export const useCategories = (options?: QueryOptions<{ categories: Category[] }>) =>
  useQuery<{ categories: Category[] }>({
    queryKey: ['categories'],
    queryFn: () => apiFetch<{ categories: Category[] }>('/api/categories'),
    ...options
  });
export const useCategory = (id: string) => useQuery<Category>({ queryKey: ['category', id], queryFn: () => apiFetch<Category>(`/api/categories/${id}`) });

export const useItems = (options?: QueryOptions<{ items: Item[] }>) =>
  useQuery<{ items: Item[] }>({
    queryKey: ['items'],
    queryFn: async () => {
      const data = await apiFetch<{ items: Item[] }>('/api/items');
      return {
        items: data.items.map(item => ({
          ...item,
          price: Number(item.price),
        }))
      };
    },
    ...options
  });
export const useItem = (id: string) => useQuery<Item>({ queryKey: ['item', id], queryFn: () => apiFetch<Item>(`/api/items/${id}`) });

export const useOrganizations = () => useQuery<Organization[]>({ queryKey: ['organizations'], queryFn: () => apiFetch<Organization[]>('/api/organizations') });
export const useOrganization = (id: string) => useQuery<Organization>({ queryKey: ['organization', id], queryFn: () => apiFetch<Organization>(`/api/organizations/${id}`) });

export const useOrders = (skip = 0, limit?: number, options?: QueryOptions<{ orders: Order[]; count: number; total: number }>) =>
  useQuery<{ orders: Order[]; count: number; total: number }>({
    queryKey: ['orders', skip, limit],
    queryFn: () => apiFetch<{ orders: Order[]; count: number; total: number }>(`/api/orders?skip=${skip}${typeof limit === 'number' ? `&limit=${limit}` : ''}`),
    ...options
  });

export const useOrder = (id: string) => useQuery<{ order: Order }>({ queryKey: ['order', id], queryFn: () => apiFetch<{ order: Order }>(`/api/orders/${id}`) });

export const useOrdersByUser = (userId: string, skip = 0, limit?: number, options?: QueryOptions<{ orders: Order[]; count: number; total: number }>) =>
  useQuery<{ orders: Order[]; count: number; total: number }>({
    queryKey: ['ordersbyuser', userId, skip, limit],
    queryFn: () => apiFetch<{ orders: Order[]; count: number; total: number }>(`/api/orders/byuser/${userId}?skip=${skip}${typeof limit === 'number' ? `&limit=${limit}` : ''}`),
    ...options
  });

export const useOrderItems = () => useQuery<OrderItem[]>({ queryKey: ['orderitems'], queryFn: () => apiFetch<OrderItem[]>('/api/orderitems') });
export const useOrderItem = (id: string) => useQuery<OrderItem>({ queryKey: ['orderitem', id], queryFn: () => apiFetch<OrderItem>(`/api/orderitems/${id}`) });

export const usePrinters = () => useQuery<Printer[]>({ queryKey: ['printers'], queryFn: () => apiFetch<Printer[]>('/api/printers') });
export const usePrinter = (id: string) => useQuery<Printer>({ queryKey: ['printer', id], queryFn: () => apiFetch<Printer>(`/api/printers/${id}`) });

export const useSettings = () => useQuery<{ setting: Setting }>({ queryKey: ['settings'], queryFn: () => apiFetch<{ setting: Setting }>('/api/settings') });

export const useNotifications = (skip = 0, limit = 5, options?: QueryOptions<{ notifications: Notification[]; count: number; total: number }>) =>
  useQuery<{ notifications: Notification[]; count: number; total: number }>({
    queryKey: ['notifications', skip, limit],
    queryFn: () => apiFetch<{ notifications: Notification[]; count: number; total: number }>(`/api/notifications?skip=${skip}&limit=${limit}`),
    ...options
  });

export const useTables = (options?: QueryOptions<{ tables: Table[] }>) =>
  useQuery<{ tables: Table[] }>({
    queryKey: ['tables'],
    queryFn: () => apiFetch<{ tables: Table[] }>('/api/tables'),
    ...options
  });
export const useTable = (id: string) => useQuery<Table>({ queryKey: ['table', id], queryFn: () => apiFetch<Table>(`/api/tables/${id}`) });

export const useUnits = (options?: QueryOptions<{ units: Unit[] }>) =>
  useQuery<{ units: Unit[] }>({
    queryKey: ['units'],
    queryFn: () => apiFetch<{ units: Unit[] }>('/api/units'),
    ...options
  });
export const useUnit = (id: string) => useQuery<Unit>({ queryKey: ['unit', id], queryFn: () => apiFetch<Unit>(`/api/units/${id}`) });

export const useUsers = () => useQuery<User[]>({ queryKey: ['users'], queryFn: () => apiFetch<User[]>('/api/users') });
export const useUser = (id: string, options?: QueryOptions<User>) => useQuery<User>({
  queryKey: ['user', id],
  queryFn: async () => {
    try {
      return await apiFetch<User>(`/api/users/${id}`);
    } catch (err: any) {
      // Only handle 400 for the current user
      if (err instanceof Error && err.message && typeof window !== 'undefined') {
        // Optionally, check if id matches current user id if available
        if (err.message.includes('400')) {
          localStorage.removeItem("gmbh-auth-jwt");
          window.location.reload();
        }
      }
      throw err;
    }
  },
  ...options
});

// Mutation hooks for POST/PUT/DELETE endpoints
export const useCreateArea = () => useMutation({ mutationFn: (data: Partial<Area>) => apiFetch<Area>('/api/areas/', { method: 'POST', body: JSON.stringify(data) }) });
export const useUpdateArea = () => useMutation({ mutationFn: (data: Partial<Area> & { id: number }) => apiFetch<Area>(`/api/areas/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }) });
export const useDeleteArea = () => useMutation({ mutationFn: (id: number) => apiFetch(`/api/areas/${id}`, { method: 'DELETE' }) });

export const useCreateCategory = () => useMutation({ mutationFn: (data: Partial<Category>) => apiFetch<Category>('/api/categories/', { method: 'POST', body: JSON.stringify(data) }) });
export const useUpdateCategory = () => useMutation({ mutationFn: (data: Partial<Category> & { id: number }) => apiFetch<Category>(`/api/categories/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }) });
export const useDeleteCategory = () => useMutation({ mutationFn: (id: number) => apiFetch(`/api/categories/${id}`, { method: 'DELETE' }) });

export const useCreateItem = () => useMutation({ mutationFn: (data: Partial<Item>) => apiFetch<Item>('/api/items/', { method: 'POST', body: JSON.stringify(data) }) });
export const useUpdateItem = () => useMutation({ mutationFn: (data: Partial<Item> & { id: number }) => apiFetch<Item>(`/api/items/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }) });
export const useDeleteItem = () => useMutation({ mutationFn: (id: number) => apiFetch(`/api/items/${id}`, { method: 'DELETE' }) });

export const useCreateOrganization = () => useMutation({ mutationFn: (data: Partial<Organization>) => apiFetch<Organization>('/api/organizations/', { method: 'POST', body: JSON.stringify(data) }) });
export const useUpdateOrganization = () => useMutation({ mutationFn: (data: Partial<Organization> & { id: number }) => apiFetch<Organization>(`/api/organizations/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }) });
export const useDeleteOrganization = () => useMutation({ mutationFn: (id: number) => apiFetch(`/api/organizations/${id}`, { method: 'DELETE' }) });

export const useCreateOrder = () => useMutation({
  mutationFn: (data: { order: { tableId: string | null; customTableName?: string | null; orderitems: Array<Pick<OrderItem, 'itemId' | 'count' | 'extras' | 'price'>> } }) =>
    apiFetch<{ order: Order }>('/api/orders', { method: 'POST', body: JSON.stringify(data) })
});
export const useUpdateOrder = () => useMutation({
  mutationFn: (data: { order: { id: string; orderitems?: Array<Pick<OrderItem, 'id' | 'price' | 'countPaid' | 'countFree' | 'count'>> } }) =>
    apiFetch<Order>(`/api/orders/${data.order.id}`, { method: 'PUT', body: JSON.stringify(data) })
});
export const useDeleteOrder = () => useMutation({ mutationFn: (id: number) => apiFetch(`/api/orders/${id}`, { method: 'DELETE' }) });

export const useCreateOrderItem = () => useMutation({ mutationFn: (data: Partial<OrderItem>) => apiFetch<OrderItem>('/api/orderitems/', { method: 'POST', body: JSON.stringify(data) }) });
export const useUpdateOrderItem = () => useMutation({ mutationFn: (data: Partial<OrderItem> & { id: number }) => apiFetch<OrderItem>(`/api/orderitems/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }) });
export const useDeleteOrderItem = () => useMutation({ mutationFn: (id: number) => apiFetch(`/api/orderitems/${id}`, { method: 'DELETE' }) });

export const useCreatePrinter = () => useMutation({ mutationFn: (data: Partial<Printer>) => apiFetch<Printer>('/api/printers/', { method: 'POST', body: JSON.stringify(data) }) });
export const useUpdatePrinter = () => useMutation({ mutationFn: (data: Partial<Printer> & { id: string }) => apiFetch<Printer>(`/api/printers/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }) });
export const useDeletePrinter = () => useMutation({ mutationFn: (id: string) => apiFetch(`/api/printers/${id}`, { method: 'DELETE' }) });

export const useCreateSetting = () => useMutation({ mutationFn: (data: Partial<Setting>) => apiFetch<{ setting: Setting }>('/api/settings/', { method: 'POST', body: JSON.stringify({ setting: data }) }) });
export const useUpdateSetting = () => useMutation({ mutationFn: (data: Partial<Setting>) => apiFetch<{ setting: Setting }>('/api/settings/', { method: 'PUT', body: JSON.stringify({ setting: data }) }) });

export const useCreateTable = () => useMutation({ mutationFn: (data: Partial<Table>) => apiFetch<Table>('/api/tables/', { method: 'POST', body: JSON.stringify(data) }) });
export const useUpdateTable = () => useMutation({ mutationFn: (data: Partial<Table> & { id: number }) => apiFetch<Table>(`/api/tables/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }) });
export const useDeleteTable = () => useMutation({ mutationFn: (id: number) => apiFetch(`/api/tables/${id}`, { method: 'DELETE' }) });

export const useCreateUnit = () => useMutation({ mutationFn: (data: Partial<Unit>) => apiFetch<Unit>('/api/units/', { method: 'POST', body: JSON.stringify(data) }) });
export const useUpdateUnit = () => useMutation({ mutationFn: (data: Partial<Unit> & { id: number }) => apiFetch<Unit>(`/api/units/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }) });
export const useDeleteUnit = () => useMutation({ mutationFn: (id: number) => apiFetch(`/api/units/${id}`, { method: 'DELETE' }) });

export const useCreateUser = () => useMutation({ mutationFn: (data: Partial<User>) => apiFetch<User>('/api/users/', { method: 'POST', body: JSON.stringify(data) }) });
export const useUpdateUser = () => useMutation({ mutationFn: (data: Partial<User> & { id: number }) => apiFetch<User>(`/api/users/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }) });
export const useDeleteUser = () => useMutation({ mutationFn: (id: number) => apiFetch(`/api/users/${id}`, { method: 'DELETE' }) });

export const useAuthenticateUser = () => useMutation({ mutationFn: (data: { username: string; password: string }) => apiFetch<{ token: string }>('/authenticate', { method: 'POST', body: JSON.stringify(data) }) });
export const usePrintOrder = () => useMutation({ mutationFn: (data: { print: { orderId: string, printId: string } }) => apiFetch<{ print: { printId: string; orderId: string; } }>('/api/prints', { method: 'POST', body: JSON.stringify(data) }) });
