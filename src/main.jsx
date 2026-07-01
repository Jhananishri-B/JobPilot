import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthGuard } from 'lemma-sdk/react'
import { Loader2 } from 'lucide-react'
import './index.css'
import App from './App.jsx'
import { lemmaClient } from './lib/lemma'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function AuthLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="card p-8 flex flex-col items-center text-center max-w-sm w-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" aria-hidden="true" />
        <p className="text-sm text-muted">Connecting to JobPilot AI...</p>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthGuard client={lemmaClient} appName="JobPilot AI" loadingFallback={<AuthLoadingFallback />}>
        <App />
      </AuthGuard>
    </QueryClientProvider>
  </StrictMode>,
)
