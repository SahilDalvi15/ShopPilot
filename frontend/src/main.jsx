import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from './contexts/ToastContext'
import { SocketProvider } from './contexts/SocketContext'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import App from './App.jsx'
import store from './store/store'
import queryClient from './lib/react-query'
import ToastContainer from './components/ToastContainer'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Router>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <SocketProvider>
              <ToastProvider>
                <App />
                <ToastContainer />
              </ToastProvider>
            </SocketProvider>
          </QueryClientProvider>
        </Provider>
      </Router>
    </ErrorBoundary>
  </StrictMode>,
)
