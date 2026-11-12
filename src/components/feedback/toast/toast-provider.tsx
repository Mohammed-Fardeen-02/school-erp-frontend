import React, { useState, useCallback, useMemo } from 'react';
import type {
  ToastNotification,
  ToastConfig,
  ToastType,
  ShowToastOptions,
  ToastContextValue,
} from './toast-types';
import { ToastContext } from './toast-context';
import { ToastContainer } from './toast-container';

export interface ToastProviderProps {
  children: React.ReactNode;
  config?: ToastConfig;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  config = {},
}) => {
  const {
    defaultDuration = 4000,
    position = 'top-right',
    maxToasts = 5,
  } = config;

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (message: React.ReactNode, options?: ShowToastOptions | ToastType): string => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      const parsedOptions: ShowToastOptions =
        typeof options === 'string'
          ? { type: options }
          : options || {};

      const newToast: ToastNotification = {
        id,
        type: parsedOptions.type || 'info',
        title: parsedOptions.title,
        message,
        duration: parsedOptions.duration !== undefined ? parsedOptions.duration : defaultDuration,
        action: parsedOptions.action,
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        const updated = [newToast, ...prev];
        if (updated.length > maxToasts) {
          return updated.slice(0, maxToasts);
        }
        return updated;
      });

      return id;
    },
    [defaultDuration, maxToasts]
  );

  const success = useCallback(
    (message: React.ReactNode, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>) => {
      return showToast(message, { ...options, type: 'success', title });
    },
    [showToast]
  );

  const error = useCallback(
    (message: React.ReactNode, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>) => {
      return showToast(message, { ...options, type: 'error', title: title ?? 'Error' });
    },
    [showToast]
  );

  const warning = useCallback(
    (message: React.ReactNode, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>) => {
      return showToast(message, { ...options, type: 'warning', title });
    },
    [showToast]
  );

  const info = useCallback(
    (message: React.ReactNode, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>) => {
      return showToast(message, { ...options, type: 'info', title });
    },
    [showToast]
  );

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      toasts,
      showToast,
      dismissToast,
      clearAllToasts,
      success,
      error,
      warning,
      info,
    }),
    [toasts, showToast, dismissToast, clearAllToasts, success, error, warning, info]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        toasts={toasts}
        position={position}
        onDismiss={dismissToast}
      />
    </ToastContext.Provider>
  );
};
