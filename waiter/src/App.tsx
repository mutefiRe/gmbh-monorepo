
import './App.css'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Link, Route, Switch, Router, Redirect } from "wouter";


import { DebugOverlay } from './debug-overlay'
import { StateWrapper } from './state-wrapper';
import { AuthProvider, useAuth } from './auth-wrapper';
import { Login } from './login';
import { Logout } from './logout';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router >

        <AuthProvider>

          <div className="App">
            <DebugOverlay />

            <Switch >

              <Route path="/login" component={() => <Login />} />
              <Route path="/logout" component={() => <Logout />} />

              <Route path="/" nest>
                <LoggedInGuard>
                  <nav className="left-0 w-full flex px-4 items-center gap-4 py-3 bg-gray-100 border-t border-gray-200 text-sm font-medium z-50 shadow-md h-[50px]">
                    <Link className={(isActive) => `flex flex-col items-center focus:outline-none active:scale-90 transition-all duration-200 ${isActive ? "text-blue-500" : ""}`} href="/order/new">
                      <span role="img" aria-label="Bestellen">🛒</span>
                      <span className="text-xs">Bestellen</span>
                    </Link>
                    <Link className={(isActive) => `flex flex-col items-center focus:outline-none active:scale-90 transition-all duration-200 ${isActive ? "text-blue-500" : ""}`} href="/orders">
                      <span role="img" aria-label="Historie">📜</span>
                      <span className="text-xs">Bestellhistorie</span>
                    </Link>
                    <Link role="button" className={(isActive) => `flex flex-col items-center focus:outline-none active:scale-90 transition-all duration-200 ${isActive ? "text-blue-500" : ""}`} href="/settings">
                      <span role="img" aria-label="Einstellungen">⚙️</span>
                      <span className="text-xs">Einstellungen</span>
                    </Link>
                    <Link role="button" className={(isActive) => `flex flex-col items-center focus:outline-none active:scale-90 transition-all duration-200 ${isActive ? "text-blue-500" : ""}`} href="/notifications">
                      <span role="img" aria-label="Benachrichtigungen">🔔</span>
                      <span className="text-xs">Benachrichtigungen</span>
                    </Link>
                  </nav>

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



function LoggedInGuard({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (!auth.token) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}