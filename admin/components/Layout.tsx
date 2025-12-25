import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  LayoutDashboard,
  BarChart3,
  UtensilsCrossed,
  Users,
  Map,
  Receipt,
  Menu,
  Bell,
  LogOut,
  Ruler,
  Printer,
  Layers,
  X,
  Calendar,
  ArrowUpCircle
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
      ? 'bg-primary-500 text-white shadow-md shadow-primary-200'
      : 'text-slate-500 hover:bg-white hover:text-primary hover:shadow-sm'
      }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const getPageTitle = (path: string) => {
  switch (path.split('/')?.[1]) {
    case '': return 'Systemstatus';
    case 'statistics': return 'Statistik (experimentell)';
    case 'orders': return 'Bestellungen';
    case 'items': return 'Speisekarte';
    case 'categories': return 'Kategorien';
    case 'areas': return 'Bereiche & Tische';
    case 'users': return 'Benutzer';
    case 'units': return 'Einheiten';
    case 'printers': return 'Drucker';
    case 'events': return 'Events';
    case 'settings': return 'Einstellungen';
    case 'update': return 'Updates';
    default: return 'g.m.b.h. Admin';
  }
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: eventsResponse } = useQuery({
    queryKey: ['events'],
    queryFn: api.getEvents
  });
  const [selectedEventId, setSelectedEventId] = useState<string | null>(api.getEventId());
  const events = eventsResponse?.events ?? [];
  const activeEventId = eventsResponse?.activeEventId ?? null;
  const previousActiveId = useRef<string | null>(null);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId),
    [events, selectedEventId]
  );
  const selectedIsActive = selectedEvent ? selectedEvent.id === activeEventId : false;

  useEffect(() => {
    if (!events.length) {
      return;
    }
    const activeId = activeEventId || events[0]?.id || null;
    const currentId = selectedEventId;
    const current = currentId ? events.find((event) => event.id === currentId) : undefined;
    const hasCurrent = Boolean(current);
    const shouldAdoptActive = Boolean(
      activeId
      && (
        !hasCurrent
        || (previousActiveId.current && currentId === previousActiveId.current && activeId !== currentId)
      )
    );

    if (activeId && shouldAdoptActive) {
      setSelectedEventId(activeId);
      api.setEventId(activeId);
      queryClient.invalidateQueries();
    }

    previousActiveId.current = activeId;
  }, [activeEventId, events, queryClient, selectedEventId]);

  const handleEventChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextEventId = event.target.value;
    setSelectedEventId(nextEventId);
    api.setEventId(nextEventId);
    queryClient.invalidateQueries();
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar for desktop */}
      <aside className="w-64 bg-slate-100 border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="p-2 bg-primary-600 rounded-lg text-white">
              <UtensilsCrossed size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">g.m.b.h.</h1>
              <span className="text-xs font-semibold tracking-widest text-primary uppercase">Admin</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
          <NavItem to="/" icon={LayoutDashboard} label="Systemstatus" active={location.pathname === '/'} />
          <NavItem to="/statistics" icon={BarChart3} label="Statistik (experimentell)" active={location.pathname === '/statistics'} />
          <NavItem to="/orders" icon={Receipt} label="Bestellungen" active={location.pathname === '/orders'} />
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Verwaltung</p>
          </div>
          <NavItem to="/items" icon={Menu} label="Speisekarte" active={location.pathname === '/items'} />
          <NavItem to="/categories" icon={Layers} label="Kategorien" active={location.pathname === '/categories'} />
          <NavItem to="/areas" icon={Map} label="Bereiche & Tische" active={location.pathname === '/areas'} />
          <NavItem to="/units" icon={Ruler} label="Einheiten" active={location.pathname === '/units'} />
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Globale Einstellungen</p>
          </div>
          <NavItem to="/users" icon={Users} label="Benutzer" active={location.pathname === '/users'} />
          <NavItem to="/printers" icon={Printer} label="Drucker" active={location.pathname === '/printers'} />
          <NavItem to="/events" icon={Calendar} label="Events" active={location.pathname === '/events'} />
          <NavItem
            to="/update"
            icon={ArrowUpCircle}
            label="Updates (experimentell)"
            active={location.pathname === '/update'}
          />
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-2">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Abmelden</span>
          </button>
        </div>
      </aside>

      {/* Sidebar for mobile (drawer) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)}></div>
          <aside className="relative w-64 bg-slate-100 border-r border-slate-200 flex flex-col h-full z-50 animate-slide-in-left">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800">
                <div className="p-2 bg-primary-600 rounded-lg text-white">
                  <UtensilsCrossed size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold leading-tight">g.m.b.h.</h1>
                  <span className="text-xs font-semibold tracking-widest text-primary uppercase">Admin</span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="ml-4 p-2 text-slate-400 hover:text-primary">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
              <NavItem to="/" icon={LayoutDashboard} label="Systemstatus" active={location.pathname === '/'} />
              <NavItem to="/statistics" icon={BarChart3} label="Statistik (experimentell)" active={location.pathname === '/statistics'} />
              <NavItem to="/orders" icon={Receipt} label="Bestellungen" active={location.pathname === '/orders'} />
              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Verwaltung</p>
              </div>
              <NavItem to="/items" icon={Menu} label="Speisekarte" active={location.pathname === '/items'} />
              <NavItem to="/categories" icon={Layers} label="Kategorien" active={location.pathname === '/categories'} />
              <NavItem to="/areas" icon={Map} label="Bereiche & Tische" active={location.pathname === '/areas'} />
              <NavItem to="/units" icon={Ruler} label="Einheiten" active={location.pathname === '/units'} />
              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Globale Einstellungen</p>
              </div>
              <NavItem to="/users" icon={Users} label="Benutzer" active={location.pathname === '/users'} />
              <NavItem to="/printers" icon={Printer} label="Drucker" active={location.pathname === '/printers'} />
              <NavItem to="/events" icon={Calendar} label="Events" active={location.pathname === '/events'} />
              <NavItem
                to="/update"
                icon={ArrowUpCircle}
                label="Updates (experimentell)"
                active={location.pathname === '/update'}
              />
            </nav>
            <div className="p-4 border-t border-slate-200 space-y-2">
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Abmelden</span>
              </button>
            </div>
          </aside>
        </div >
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
            {/* Burger menu for mobile */}
            <button className="md:hidden p-2 text-slate-400 hover:text-primary" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-slate-700 capitalize">
              {getPageTitle(location.pathname)}
            </h2>
          </div>
          {events.length > 0 && (
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Event</span>
              <div className="flex items-center gap-2">
                <select
                  value={selectedEventId || ''}
                  onChange={handleEventChange}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                >
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}{event.id === activeEventId ? ' (aktiv)' : ''}
                    </option>
                  ))}
                </select>
                {selectedEvent && (
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${selectedIsActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                      }`}
                  >
                    {selectedIsActive ? 'Aktiv' : 'Inaktiv'}
                  </span>
                )}
              </div>
            </div>
          )}

        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div >
  );
};
