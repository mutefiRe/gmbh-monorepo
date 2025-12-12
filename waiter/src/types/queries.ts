import { useQuery, useMutation, type UndefinedInitialDataOptions } from '@tanstack/react-query';
import type {
  Area,
  Category,
  Item,
  Organization,
  Order,
  OrderItem,
  Printer,
  Setting,
  Table,
  Unit,
  User
} from './models';

// should be same hostname and port as the frontend is served from
const API_BASE = '';

// Improved API client with error handling
const apiFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
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
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Query hooks for GET endpoints
export const useAreas = () => useQuery({ queryKey: ['areas'], queryFn: () => apiFetch<{ areas: Area[] }>('/api/areas') });
export const useArea = (id: number) => useQuery({ queryKey: ['area', id], queryFn: () => apiFetch<Area>(`/api/areas/${id}`) });

export const useCategories = () => useQuery({ queryKey: ['categories'], queryFn: () => apiFetch<{ categories: Category[] }>('/api/categories') });
export const useCategory = (id: number) => useQuery({ queryKey: ['category', id], queryFn: () => apiFetch<Category>(`/api/categories/${id}`) });

export const useItems = () => useQuery({ queryKey: ['items'], queryFn: () => apiFetch<{ items: Item[] }>('/api/items') });
export const useItem = (id: number) => useQuery({ queryKey: ['item', id], queryFn: () => apiFetch<Item>(`/api/items/${id}`) });

export const useOrganizations = () => useQuery({ queryKey: ['organizations'], queryFn: () => apiFetch<Organization[]>('/api/organizations') });
export const useOrganization = (id: number) => useQuery({ queryKey: ['organization', id], queryFn: () => apiFetch<Organization>(`/api/organizations/${id}`) });

export const useOrders = () => useQuery({ queryKey: ['orders'], queryFn: () => apiFetch<{ orders: Order[] }>('/api/orders') });
export const useOrder = (id: number) => useQuery({ queryKey: ['order', id], queryFn: () => apiFetch<{ order: Order }>(`/api/orders/${id}`) });
export const useOrdersByUser = (userId: string, options?: UndefinedInitialDataOptions) => useQuery({ queryKey: ['ordersbyuser', userId], queryFn: () => apiFetch<{ orders: Order[] }>(`/api/orders/byuser/${userId}`), ...options });

export const useOrderItems = () => useQuery({ queryKey: ['orderitems'], queryFn: () => apiFetch<OrderItem[]>('/api/orderitems') });
export const useOrderItem = (id: number) => useQuery({ queryKey: ['orderitem', id], queryFn: () => apiFetch<OrderItem>(`/api/orderitems/${id}`) });

export const usePrinters = () => useQuery({ queryKey: ['printers'], queryFn: () => apiFetch<Printer[]>('/api/printers') });
export const usePrinter = (id: string) => useQuery({ queryKey: ['printer', id], queryFn: () => apiFetch<Printer>(`/api/printers/${id}`) });

export const useSettings = () => useQuery({ queryKey: ['settings'], queryFn: () => apiFetch<Setting[]>('/api/settings') });
export const useSetting = (id: number) => useQuery({ queryKey: ['setting', id], queryFn: () => apiFetch<Setting>(`/api/settings/${id}`) });

export const useTables = () => useQuery({ queryKey: ['tables'], queryFn: () => apiFetch<{ tables: Table[] }>('/api/tables') });
export const useTable = (id: number) => useQuery({ queryKey: ['table', id], queryFn: () => apiFetch<Table>(`/api/tables/${id}`) });

export const useUnits = () => useQuery({ queryKey: ['units'], queryFn: () => apiFetch<{ units: Unit[] }>('/api/units') });
export const useUnit = (id: number) => useQuery({ queryKey: ['unit', id], queryFn: () => apiFetch<Unit>(`/api/units/${id}`) });

export const useUsers = () => useQuery({ queryKey: ['users'], queryFn: () => apiFetch<User[]>('/api/users') });
export const useUser = (id: number, options?: Omit<UndefinedInitialDataOptions, "queryKey">) => useQuery({
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

export const useCreateOrder = () => useMutation({ mutationFn: (data: Partial<Order>) => apiFetch<Order>('/api/orders', { method: 'POST', body: JSON.stringify(data) }) });
export const useUpdateOrder = () => useMutation({ mutationFn: (data: { order: Partial<Order> & { id: string } }) => apiFetch<Order>(`/api/orders/${data.order.id}`, { method: 'PUT', body: JSON.stringify(data) }) },);
export const useDeleteOrder = () => useMutation({ mutationFn: (id: number) => apiFetch(`/api/orders/${id}`, { method: 'DELETE' }) });

export const useCreateOrderItem = () => useMutation({ mutationFn: (data: Partial<OrderItem>) => apiFetch<OrderItem>('/api/orderitems/', { method: 'POST', body: JSON.stringify(data) }) });
export const useUpdateOrderItem = () => useMutation({ mutationFn: (data: Partial<OrderItem> & { id: number }) => apiFetch<OrderItem>(`/api/orderitems/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }) });
export const useDeleteOrderItem = () => useMutation({ mutationFn: (id: number) => apiFetch(`/api/orderitems/${id}`, { method: 'DELETE' }) });

export const useCreatePrinter = () => useMutation({ mutationFn: (data: Partial<Printer>) => apiFetch<Printer>('/api/printers/', { method: 'POST', body: JSON.stringify(data) }) });
export const useUpdatePrinter = () => useMutation({ mutationFn: (data: Partial<Printer> & { id: string }) => apiFetch<Printer>(`/api/printers/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }) });
export const useDeletePrinter = () => useMutation({ mutationFn: (id: string) => apiFetch(`/api/printers/${id}`, { method: 'DELETE' }) });

export const useCreateSetting = () => useMutation({ mutationFn: (data: Partial<Setting>) => apiFetch<Setting>('/api/settings/', { method: 'POST', body: JSON.stringify(data) }) });
export const useUpdateSetting = () => useMutation({ mutationFn: (data: Partial<Setting> & { id: number }) => apiFetch<Setting>(`/api/settings/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }) });
export const useDeleteSetting = () => useMutation({ mutationFn: (id: number) => apiFetch(`/api/settings/${id}`, { method: 'DELETE' }) });

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