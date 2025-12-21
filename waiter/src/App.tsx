
import './App.css'
import { Link, Route, Switch, Router, Redirect, useLocation } from "wouter";


import { DebugOverlay } from './debug-overlay'
import { StateWrapper } from './state-wrapper';
import { AuthProvider, useAuth } from './auth-wrapper';
import { Login } from './login';
import { Logout } from './logout';
import { Bell, BookOpen, LogOut, Menu, Plus, ReceiptText, Settings, ShoppingCart, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from 'react';
import { useConnectionStatus } from './hooks/useConnectionStatus';
import { useOfflineOrderQueue } from './hooks/useOfflineOrderQueue';
import { Modal } from './ui/modal';
import { ConnectionPill } from "./ui/connection-pill";
import { MenuLink } from "./ui/menu-link";
import { useUnreadNotifications } from "./hooks/useUnreadNotifications";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const onOrdersPage = location.startsWith("/orders");
  const connection = useConnectionStatus();
  const { pendingCount } = useOfflineOrderQueue();
  const auth = useAuth();
  const [authError, setAuthError] = useState<{ code?: string; message?: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { hasUnread: hasUnreadNotifications, unreadLabel } = useUnreadNotifications(auth.eventId, !!auth.token);

  useEffect(() => {
    const handler = (event: Event) => {
      if (isLoggingOut) return;
      const customEvent = event as CustomEvent<{ code?: string; message?: string }>;
      setAuthError(customEvent.detail || {});
    };
    window.addEventListener('gmbh-auth-error', handler);
    return () => window.removeEventListener('gmbh-auth-error', handler);
  }, [isLoggingOut]);


  const authErrorTitle = authError?.code?.includes('auth.eventChanged')
    ? 'Event wurde gewechselt'
    : authError?.code?.includes('auth.tokenError')
      ? 'Sitzung abgelaufen'
      : 'Nicht autorisiert';

  const authErrorBody = authError?.code?.includes('auth.eventChanged')
    ? 'Das aktive Event wurde gewechselt. Bitte melden Sie sich erneut an, um weiterzuarbeiten.'
    : authError?.code?.includes('auth.tokenError')
      ? 'Ihre Sitzung ist nicht mehr gültig. Bitte melden Sie sich erneut an.'
      : 'Sie sind nicht mehr autorisiert. Bitte melden Sie sich erneut an.';

  return (
    <Router >

      <AuthProvider>

        <div className="App">
            <DebugOverlay />
            <Modal
              open={!!authError}
              onClose={() => setAuthError(null)}
              title={authErrorTitle}
              closeOnBackdropClick={false}
              closeOnEsc={false}
              showCloseAction={false}
              actions={(
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-contrast"
                  onClick={() => {
                    setIsLoggingOut(true);
                    setAuthError(null);
                    navigate('/logout');
                  }}
                >
                  Abmelden
                </button>
              )}
              contentClassName="max-w-md"
            >
              <p className="text-sm text-slate-700">{authErrorBody}</p>
            </Modal>

            <Switch >

              <Route path="/login" component={() => <Login />} />
              <Route path="/logout" component={() => <Logout />} />

              <Route path="/" nest>
                <LoggedInGuard>
                  <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200 h-[56px] flex items-center justify-between px-3">
                    <button
                      type="button"
                      onClick={() => setMenuOpen(true)}
                      className="relative p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                      aria-label="Menü öffnen"
                    >
                      <Menu size={20} />
                      {hasUnreadNotifications && (
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary-600 ring-2 ring-white" />
                      )}
                    </button>
                    <div className="flex items-center gap-2">
                      <ConnectionPill status={connection.status} pendingCount={pendingCount} />
                    </div>
                    <Link
                      className={() => "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary-300 text-primary-700 text-sm font-semibold hover:bg-primary-50 hover:border-primary-400 transition-colors"}
                      href={onOrdersPage ? "/order/new" : "/orders"}
                    >
                      {onOrdersPage ? <Plus size={16} /> : <ReceiptText size={16} />}
                      <span>{onOrdersPage ? "Bestellung aufnehmen" : "Letzte Bestellungen"}</span>
                    </Link>
                  </header>
                  

                  {menuOpen && (
                    <div
                      className="fixed inset-0 z-50"
                      onClick={() => setMenuOpen(false)}
                      role="presentation"
                    >
                      <div className="absolute inset-0 bg-black/40" />
                      <div
                        className="absolute top-3 left-3 right-3 sm:right-auto sm:w-[320px] bg-white rounded-xl border border-slate-200 shadow-lg p-3"
                        onClick={(event) => event.stopPropagation()}
                        role="presentation"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-sm font-semibold text-slate-700">Menü</h2>
                          <button
                            type="button"
                            onClick={() => setMenuOpen(false)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                            aria-label="Menü schließen"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <div className="grid gap-2">
                          <MenuLink
                            href="/order/new"
                            label="Bestellen"
                            icon={<ShoppingCart size={18} />}
                            onClick={() => setMenuOpen(false)}
                          />
                          <MenuLink
                            href="/orders"
                            label="Historie"
                            icon={<ReceiptText size={18} />}
                            onClick={() => setMenuOpen(false)}
                          />
                          <MenuLink
                            href="/settings"
                            label="Einstellungen"
                            icon={<Settings size={18} />}
                            onClick={() => setMenuOpen(false)}
                          />
                          <MenuLink
                            href="/notifications"
                            label={`Benachrichtigungen${unreadLabel ? ` (${unreadLabel})` : ""}`}
                            icon={<Bell size={18} />}
                            onClick={() => setMenuOpen(false)}
                            showIndicator={hasUnreadNotifications}
                          />
                          <MenuLink
                            href="/intro"
                            label="Einführung"
                            icon={<BookOpen size={18} />}
                            onClick={() => setMenuOpen(false)}
                          />
                          <MenuLink
                            href="/logout"
                            label="Logout"
                            icon={<LogOut size={18} />}
                            onClick={() => setMenuOpen(false)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <main>
                    <StateWrapper />
                  </main>
                </LoggedInGuard>
              </Route>

            </Switch>



          </div>

      </AuthProvider>
    </Router>
  )
}

export default App



function LoggedInGuard({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (!auth.token) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}
