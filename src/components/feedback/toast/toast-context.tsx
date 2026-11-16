import { createContext, useContext } from 'react';
import type { ToastContextValue } from './toast-types';

export const ToastContext = createContext<ToastContextValue | null>(null);

const fallbackToast: ToastContextValue = {
  toasts: [],
  showToast: () => '',
  dismissToast: () => {},
  clearAllToasts: () => {},
  success: () => '',
  error: () => '',
  warning: () => '',
  info: () => '',
};

/**
 * Hook to access the toast notification system.
 * When used outside a <ToastProvider>, safely falls back to a no-op handler.
 *
 * @example
 * const toast = useToast();
 * toast.success('Organization saved successfully');
 * toast.error('Failed to invite user', 'Validation Error');
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  return context ?? fallbackToast;
}
