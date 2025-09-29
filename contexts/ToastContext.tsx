import React, { createContext, useState, useContext, useCallback, type FC } from 'react';
import { CheckCircleIcon } from '../components/IconComponents';

interface ToastContextType {
  addToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface Toast {
  id: number;
  message: string;
}

export const ToastProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = React.useRef(0);

  const addToast = useCallback((message: string) => {
    const id = toastIdRef.current++;
    setToasts(currentToasts => [...currentToasts, { id, message }]);
    setTimeout(() => {
      setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-5 right-5 z-[200] space-y-3">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="flex items-center gap-3 bg-slate-800 text-white font-semibold py-3 px-5 rounded-lg shadow-lg border border-emerald-500/50 animate-fade-in-down"
            role="status"
            aria-live="polite"
          >
            <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
