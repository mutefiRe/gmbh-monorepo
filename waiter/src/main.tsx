import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import './legacy-fastclick'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './ui/error-boundary'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectionStatusProvider } from './context/ConnectionStatusContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>

      <QueryClientProvider client={queryClient}>
        <ConnectionStatusProvider>
          <App />
        </ConnectionStatusProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
