import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from './contexts/ToastContext'
import { SocketProvider } from './contexts/SocketContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { CurrencyProvider } from './contexts/CurrencyContext'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import store from './store/store'
import queryClient from './lib/react-query'
import ToastContainer from './components/ToastContainer'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <SocketProvider>
              <ThemeProvider>
                <CurrencyProvider>
                  <ToastProvider>
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy_client_id'}>
                      <App />
                      <ToastContainer />
                    </GoogleOAuthProvider>
                  </ToastProvider>
                </CurrencyProvider>
              </ThemeProvider>
            </SocketProvider>
          </QueryClientProvider>
        </Provider>
      </Router>
    </ErrorBoundary>
  </StrictMode>,
)
