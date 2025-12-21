
import './App.css'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
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

const queryClient = new QueryClient()

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const onOrdersPage = location.startsWith("/orders");
  const connection = useConnectionStatus();
  const { pendingCount } = useOfflineOrderQueue();
  useAuth();
  const [authError, setAuthError] = useState<{ code?: string; message?: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    <QueryClientProvider client={queryClient}>
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
                    window.location.href = '#/logout';
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
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                      aria-label="Menü öffnen"
                    >
                      <Menu size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                      <StatusPill status={connection.status} pendingCount={pendingCount} />
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
                          <Link
                            className={() => "flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"}
                            href="/order/new"
                            onClick={() => setMenuOpen(false)}
                          >
                            <ShoppingCart size={18} />
                            <span>Bestellen</span>
                          </Link>
                          <Link
                            className={() => "flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"}
                            href="/orders"
                            onClick={() => setMenuOpen(false)}
                          >
                            <ReceiptText size={18} />
                            <span>Historie</span>
                          </Link>
                          <Link
                            className={() => "flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"}
                            href="/intro"
                            onClick={() => setMenuOpen(false)}
                          >
                            <BookOpen size={18} />
                            <span>Einführung</span>
                          </Link>
                          <Link
                            className={() => "flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"}
                            href="/settings"
                            onClick={() => setMenuOpen(false)}
                          >
                            <Settings size={18} />
                            <span>Einstellungen</span>
                          </Link>
                          <Link
                            className={() => "flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"}
                            href="/notifications"
                            onClick={() => setMenuOpen(false)}
                          >
                            <Bell size={18} />
                            <span>Hinweise</span>
                          </Link>
                          <Link
                            className={() => "flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"}
                            href="/logout"
                            onClick={() => setMenuOpen(false)}
                          >
                            <LogOut size={18} />
                            <span>Logout</span>
                          </Link>
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

    </QueryClientProvider >
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

function StatusPill({ status, pendingCount }: { status: string; pendingCount: number }) {
  if (status === "checking") {
    return (
      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-500">
        Prüfe Verbindung...
      </span>
    );
  }

  if (status === "online") {
    return (
      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
        Verbunden{pendingCount > 0 ? ` · ${pendingCount} ausstehend` : ""}
      </span>
    );
  }

  if (status === "server-unreachable") {
    return (
      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700">
        Server nicht erreichbar{pendingCount > 0 ? ` · ${pendingCount} ausstehend` : ""}
      </span>
    );
  }

  return (
    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-rose-100 text-rose-700">
      Offline{pendingCount > 0 ? ` · ${pendingCount} ausstehend` : ""}
    </span>
  );
}
