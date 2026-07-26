import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((toast) => {
    const id = Date.now();
    setToasts((prev) => [
      ...prev,
      {
        id,
        type: 'info',
        title: 'Notification',
        autoDismiss: true,
        duration: 3000,
        ...toast,
      },
    ]);
    return id;
  }, []);

  const success = useCallback((title, message, options = {}) => {
    return showToast({ type: 'success', title, message, ...options });
  }, [showToast]);

  const error = useCallback((title, message, options = {}) => {
    return showToast({ type: 'error', title, message, ...options });
  }, [showToast]);

  const warning = useCallback((title, message, options = {}) => {
    return showToast({ type: 'warning', title, message, ...options });
  }, [showToast]);

  const info = useCallback((title, message, options = {}) => {
    return showToast({ type: 'info', title, message, ...options });
  }, [showToast]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    toasts,
    showToast,
    success,
    error,
    warning,
    info,
    removeToast,
    clearAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
