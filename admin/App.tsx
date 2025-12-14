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
import { NotificationProvider, useNotification } from './components/NotificationProvider';
import { SettingsPage } from './pages/SettingsPage';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

type AppContextType = {
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
} | null;

export const AppContext = React.createContext<AppContextType>(null);

const AuthenticatedApp = () => {
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();
  const nf = useNotification();

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

  // --- Mutations with onError and improved onSuccess ---
  const createItemMutation = useMutation({
    mutationFn: api.createItem,
    onError: () => nf.notify('Fehler beim Erstellen des Artikels', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['items'] });
      nf.notify('Artikel erstellt', 'success');
    }
  });
  const updateItemMutation = useMutation({
    mutationFn: api.updateItem,
    onError: () => nf.notify('Fehler beim Aktualisieren des Artikels', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['items'] });
      nf.notify('Artikel aktualisiert', 'success');
    }
  });
  const deleteItemMutation = useMutation({
    mutationFn: api.deleteItem,
    onError: () => nf.notify('Fehler beim Löschen des Artikels', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['items'] });
      nf.notify('Artikel gelöscht', 'success');
    }
  });

  const createUserMutation = useMutation({
    mutationFn: api.createUser,
    onError: () => nf.notify('Fehler beim Erstellen des Benutzers', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      nf.notify('Benutzer erstellt', 'success');
    }
  });
  const updateUserMutation = useMutation({
    mutationFn: api.updateUser,
    onError: () => nf.notify('Fehler beim Aktualisieren des Benutzers', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      nf.notify('Benutzer aktualisiert', 'success');
    }
  });
  const deleteUserMutation = useMutation({
    mutationFn: api.deleteUser,
    onError: () => nf.notify('Fehler beim Löschen des Benutzers', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      nf.notify('Benutzer gelöscht', 'success');
    }
  });

  const createAreaMutation = useMutation({
    mutationFn: api.createArea,
    onError: () => nf.notify('Fehler beim Erstellen des Bereichs', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['areas'] });
      nf.notify('Bereich erstellt', 'success');
    }
  });
  const updateAreaMutation = useMutation({
    mutationFn: api.updateArea,
    onError: () => nf.notify('Fehler beim Aktualisieren des Bereichs', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['areas'] });
      nf.notify('Bereich aktualisiert', 'success');
    }
  });
  const deleteAreaMutation = useMutation({
    mutationFn: api.deleteArea,
    onError: () => nf.notify('Fehler beim Löschen des Bereichs', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['areas'] });
      nf.notify('Bereich gelöscht', 'success');
    }
  });

  const createTableMutation = useMutation({
    mutationFn: api.createTable,
    onError: () => nf.notify('Fehler beim Erstellen des Tisches', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tables'] });
      nf.notify('Tisch erstellt', 'success');
    }
  });
  const updateTableMutation = useMutation({
    mutationFn: api.updateTable,
    onError: () => nf.notify('Fehler beim Aktualisieren des Tisches', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tables'] });
      nf.notify('Tisch aktualisiert', 'success');
    }
  });
  const deleteTableMutation = useMutation({
    mutationFn: api.deleteTable,
    onError: () => nf.notify('Fehler beim Löschen des Tisches', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tables'] });
      nf.notify('Tisch gelöscht', 'success');
    }
  });

  const createUnitMutation = useMutation({
    mutationFn: api.createUnit,
    onError: () => nf.notify('Fehler beim Erstellen der Einheit', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['units'] });
      nf.notify('Einheit erstellt', 'success');
    }
  });
  const updateUnitMutation = useMutation({
    mutationFn: api.updateUnit,
    onError: () => nf.notify('Fehler beim Aktualisieren der Einheit', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['units'] });
      nf.notify('Einheit aktualisiert', 'success');
    }
  });
  const deleteUnitMutation = useMutation({
    mutationFn: api.deleteUnit,
    onError: () => nf.notify('Fehler beim Löschen der Einheit', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['units'] });
      nf.notify('Einheit gelöscht', 'success');
    }
  });

  const createPrinterMutation = useMutation({
    mutationFn: api.createPrinter,
    onError: () => nf.notify('Fehler beim Erstellen des Druckers', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['printers'] });
      nf.notify('Drucker erstellt', 'success');
    }
  });
  const updatePrinterMutation = useMutation({
    mutationFn: api.updatePrinter,
    onError: () => nf.notify('Fehler beim Aktualisieren des Druckers', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['printers'] });
      nf.notify('Drucker aktualisiert', 'success');
    }
  });
  const deletePrinterMutation = useMutation({
    mutationFn: api.deletePrinter,
    onError: () => nf.notify('Fehler beim Löschen des Druckers', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['printers'] });
      nf.notify('Drucker gelöscht', 'success');
    }
  });
  const scanPrintersMutation = useMutation({
    mutationFn: api.scanPrinters,
    onError: () => nf.notify('Fehler beim Scannen der Drucker', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['printers'] });
      nf.notify('Netzwerkdrucker aktualisiert', 'success');
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: api.createCategory,
    onError: () => nf.notify('Fehler beim Erstellen der Kategorie', 'error'),
    onSuccess: (category) => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      nf.notify(`Kategorie erstellt: ${category.name}`, 'success');
    }
  });
  const updateCategoryMutation = useMutation({
    mutationFn: api.updateCategory,
    onError: () => nf.notify('Fehler beim Aktualisieren der Kategorie', 'error'),
    onSuccess: (category) => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      nf.notify(`Kategorie aktualisiert: ${category.name}`, 'success');
    }
  });
  const deleteCategoryMutation = useMutation({
    mutationFn: api.deleteCategory,
    onError: () => nf.notify('Fehler beim Löschen der Kategorie', 'error'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      nf.notify(`Kategorie gelöscht.`, 'success');
    }
  });

  if (!isAuthenticated) {
    return <LoginPage />;
  }


  const isLoading = itemsLoading || usersLoading || areasLoading || tablesLoading || unitsLoading || printersLoading || categoriesLoading;

  return (
    <AppContext.Provider value={{
      items,
      updateItem: (i) => updateItemMutation.mutate(i),
      addItem: (i) => createItemMutation.mutate(i),
      deleteItem: (id) => deleteItemMutation.mutate(id),

      users,
      updateUser: (u) => updateUserMutation.mutate(u),
      addUser: (u) => createUserMutation.mutate(u),
      deleteUser: (id) => deleteUserMutation.mutate(id),

      areas,
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
    } as AppContextType}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/items/:id" element={<ItemsPage />} />
            <Route path="/users/:id" element={<UsersPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/areas/new" element={<AreasPage />} />
            <Route path="/areas/:id/tables" element={<AreasPage />} />
            <Route path="/areas/:id" element={<AreasPage />} />
            <Route path="/areas" element={<AreasPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/categories/:id" element={<CategoriesPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/units/:id" element={<UnitsPage />} />
            <Route path="/units" element={<UnitsPage />} />
            <Route path="/printers" element={<PrintersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AppContext.Provider>
  );
};

const App = () => {
  return (
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthenticatedApp />
        </AuthProvider>
      </QueryClientProvider>
    </NotificationProvider >
  );
};

export default App;

export function useAppContext(): AppContextType {
  const context = React.useContext(AppContext) as AppContextType;
  if (!context) {
    throw new Error('useAppContext must be used within an AppContext.Provider');
  }
  return context;
}