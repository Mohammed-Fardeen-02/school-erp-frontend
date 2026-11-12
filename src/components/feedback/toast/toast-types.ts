import React from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPosition =
  | 'top-right'
  | 'top-center'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastNotification {
  id: string;
  type: ToastType;
  title?: string;
  message: React.ReactNode;
  duration?: number; // ms, 0 means persist until dismissed
  action?: ToastAction;
  createdAt: number;
}

export type ToastItemData = ToastNotification;

export interface ToastConfig {
  defaultDuration?: number;
  position?: ToastPosition;
  maxToasts?: number;
}

export interface ShowToastOptions {
  type?: ToastType;
  title?: string;
  duration?: number;
  action?: ToastAction;
}

export interface ToastContextValue {
  toasts: ToastNotification[];
  showToast: (message: React.ReactNode, options?: ShowToastOptions | ToastType) => string;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
  success: (message: React.ReactNode, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>) => string;
  error: (message: React.ReactNode, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>) => string;
  warning: (message: React.ReactNode, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>) => string;
  info: (message: React.ReactNode, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>) => string;
}
