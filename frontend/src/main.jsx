import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from './contexts/ToastContext'
import { SocketProvider } from './contexts/SocketContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
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
                <ToastProvider>
                  <App />
                  <ToastContainer />
                </ToastProvider>
              </ThemeProvider>
            </SocketProvider>
          </QueryClientProvider>
        </Provider>
      </Router>
    </ErrorBoundary>
  </StrictMode>,
)
