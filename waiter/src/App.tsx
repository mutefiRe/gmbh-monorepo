import { useState } from 'react'
import './App.css'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { Link, Redirect, Route, Switch } from "wouter";


import { DebugOverlay } from './debug-overlay'
import { StateWrapper } from './state-wrapper';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <DebugOverlay />


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
        </nav>

        <main>
          <StateWrapper />
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App


