import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ItemsPage } from './pages/ItemsPage';
import { UsersPage } from './pages/UsersPage';
import { AreasPage } from './pages/AreasPage';
import { OrdersPage } from './pages/OrdersPage';
import { UnitsPage } from './pages/UnitsPage';
import { PrintersPage } from './pages/PrintersPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { LoginPage } from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import { Item, User, Area, Table, Category, Order, Unit, Printer } from './types';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export const AppContext = React.createContext<{
  items: Item[];
  setItems: (items: Item[]) => void;
  updateItem: (item: Item) => void;
  addItem: (item: Partial<Item>) => void;
  deleteItem: (id: number) => void;

  users: User[];
  setUsers: (users: User[]) => void;
  updateUser: (user: User) => void;
  addUser: (user: Partial<User>) => void;
  deleteUser: (id: number) => void;

  areas: Area[];
  setAreas: (areas: Area[]) => void;
  updateArea: (area: Area) => void;
  addArea: (area: Partial<Area>) => void;
  deleteArea: (id: string) => void;

  tables: Table[];
  setTables: (tables: Table[]) => void;
  createTable: (table: Partial<Table>) => void;
  updateTable: (table: Table) => void;
  deleteTable: (id: string) => void;

  units: Unit[];
  addUnit: (unit: Partial<Unit>) => void;
  updateUnit: (unit: Unit) => void;
  deleteUnit: (id: number) => void;

  printers: Printer[];
  addPrinter: (printer: Partial<Printer>) => void;
  updatePrinter: (printer: Printer) => void;
  deletePrinter: (id: number) => void;
  scanPrinters: () => void;
  isScanningPrinters: boolean;

  categories: Category[];
  addCategory: (category: Partial<Category>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: number) => void;

  orders: Order[];
  isLoading: boolean;
} | null>(null);

const AuthenticatedApp = () => {
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();

  // Queries
  const { data: items = [], isLoading: itemsLoading } = useQuery({ queryKey: ['items'], queryFn: api.getItems, enabled: isAuthenticated });
  const { data: users = [], isLoading: usersLoading } = useQuery({ queryKey: ['users'], queryFn: api.getUsers, enabled: isAuthenticated });
  const { data: areas = [], isLoading: areasLoading } = useQuery({ queryKey: ['areas'], queryFn: api.getAreas, enabled: isAuthenticated });
  const { data: tables = [], isLoading: tablesLoading } = useQuery({ queryKey: ['tables'], queryFn: api.getTables, enabled: isAuthenticated });
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({ queryKey: ['categories'], queryFn: api.getCategories, enabled: isAuthenticated });
  const { data: units = [], isLoading: unitsLoading } = useQuery({ queryKey: ['units'], queryFn: api.getUnits, enabled: isAuthenticated });
  const { data: printers = [], isLoading: printersLoading } = useQuery({ queryKey: ['printers'], queryFn: api.getPrinters, enabled: isAuthenticated });
  const { data: orders = [] } = useQuery({ queryKey: ['orders'], queryFn: api.getOrders, enabled: isAuthenticated });

  // Mutations
  const createItemMutation = useMutation({ mutationFn: api.createItem, onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }) });
  const updateItemMutation = useMutation({ mutationFn: api.updateItem, onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }) });
  const deleteItemMutation = useMutation({ mutationFn: api.deleteItem, onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }) });

  const createUserMutation = useMutation({ mutationFn: api.createUser, onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }) });
  const updateUserMutation = useMutation({ mutationFn: api.updateUser, onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }) });
  const deleteUserMutation = useMutation({ mutationFn: api.deleteUser, onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }) });

  const createAreaMutation = useMutation({ mutationFn: api.createArea, onSuccess: () => qc.invalidateQueries({ queryKey: ['areas'] }) });
  const updateAreaMutation = useMutation({ mutationFn: api.updateArea, onSuccess: () => qc.invalidateQueries({ queryKey: ['areas'] }) });
  const deleteAreaMutation = useMutation({ mutationFn: api.deleteArea, onSuccess: () => qc.invalidateQueries({ queryKey: ['areas'] }) });

  const createTableMutation = useMutation({ mutationFn: api.createTable, onSuccess: () => qc.invalidateQueries({ queryKey: ['tables'] }) });
  const updateTableMutation = useMutation({ mutationFn: api.updateTable, onSuccess: () => qc.invalidateQueries({ queryKey: ['tables'] }) });
  const deleteTableMutation = useMutation({ mutationFn: api.deleteTable, onSuccess: () => qc.invalidateQueries({ queryKey: ['tables'] }) });

  const createUnitMutation = useMutation({ mutationFn: api.createUnit, onSuccess: () => qc.invalidateQueries({ queryKey: ['units'] }) });
  const updateUnitMutation = useMutation({ mutationFn: api.updateUnit, onSuccess: () => qc.invalidateQueries({ queryKey: ['units'] }) });
  const deleteUnitMutation = useMutation({ mutationFn: api.deleteUnit, onSuccess: () => qc.invalidateQueries({ queryKey: ['units'] }) });

  const createPrinterMutation = useMutation({ mutationFn: api.createPrinter, onSuccess: () => qc.invalidateQueries({ queryKey: ['printers'] }) });
  const updatePrinterMutation = useMutation({ mutationFn: api.updatePrinter, onSuccess: () => qc.invalidateQueries({ queryKey: ['printers'] }) });
  const deletePrinterMutation = useMutation({ mutationFn: api.deletePrinter, onSuccess: () => qc.invalidateQueries({ queryKey: ['printers'] }) });
  const scanPrintersMutation = useMutation({ mutationFn: api.scanPrinters, onSuccess: () => qc.invalidateQueries({ queryKey: ['printers'] }) });

  const createCategoryMutation = useMutation({ mutationFn: api.createCategory, onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }) });
  const updateCategoryMutation = useMutation({ mutationFn: api.updateCategory, onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }) });
  const deleteCategoryMutation = useMutation({ mutationFn: api.deleteCategory, onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }) });


  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // --- Adapters for Legacy "setState" style props expected by pages ---
  const handleSetItems = (newItems: Item[]) => console.warn("setItems deprecated");
  const handleSetUsers = (newUsers: User[]) => console.warn("setUsers deprecated");
  const handleSetAreas = (newAreas: Area[]) => console.warn("setAreas deprecated");

  // Special case: AreasPage does bulk table operations using setTables.
  const handleSetTables = (newTables: Table[]) => {
    qc.setQueryData(['tables'], newTables);
  };

  const isLoading = itemsLoading || usersLoading || areasLoading || tablesLoading || unitsLoading || printersLoading || categoriesLoading;

  return (
    <AppContext.Provider value={{
      items,
      setItems: handleSetItems,
      updateItem: (i) => updateItemMutation.mutate(i),
      addItem: (i) => createItemMutation.mutate(i),
      deleteItem: (id) => deleteItemMutation.mutate(id),

      users,
      setUsers: handleSetUsers,
      updateUser: (u) => updateUserMutation.mutate(u),
      addUser: (u) => createUserMutation.mutate(u),
      deleteUser: (id) => deleteUserMutation.mutate(id),

      areas,
      setAreas: handleSetAreas,
      updateArea: (a) => updateAreaMutation.mutate(a),
      addArea: (a) => createAreaMutation.mutate(a),
      deleteArea: (id) => deleteAreaMutation.mutate(id),

      tables,
      createTable: (t) => createTableMutation.mutate(t),
      updateTable: (t) => updateTableMutation.mutate(t),
      deleteTable: (id) => deleteTableMutation.mutate(id),

      units,
      addUnit: (u) => createUnitMutation.mutate(u),
      updateUnit: (u) => updateUnitMutation.mutate(u),
      deleteUnit: (id) => deleteUnitMutation.mutate(id),

      printers,
      addPrinter: (p) => createPrinterMutation.mutate(p),
      updatePrinter: (p) => updatePrinterMutation.mutate(p),
      deletePrinter: (id) => deletePrinterMutation.mutate(id),
      scanPrinters: () => scanPrintersMutation.mutate(),
      isScanningPrinters: scanPrintersMutation.isPending,

      categories,
      addCategory: (c) => createCategoryMutation.mutate(c),
      updateCategory: (c) => updateCategoryMutation.mutate(c),
      deleteCategory: (id) => deleteCategoryMutation.mutate(id),

      orders,
      isLoading
    }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/staff" element={<UsersPage />} />
            <Route path="/areas" element={<AreasPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/units" element={<UnitsPage />} />
            <Route path="/printers" element={<PrintersPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AppContext.Provider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;