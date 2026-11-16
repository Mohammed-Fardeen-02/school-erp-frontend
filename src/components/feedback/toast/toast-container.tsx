import React from 'react';
import { cn } from '@/lib/utils';
import type { ToastNotification, ToastPosition } from './toast-types';
import { ToastItem } from './toast-item';

export interface ToastContainerProps {
  toasts: ToastNotification[];
  position?: ToastPosition;
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  const positionClasses: Record<ToastPosition, string> = {
    'top-right': 'top-4 right-4 items-end',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'top-left': 'top-4 left-4 items-start',
    'bottom-right': 'bottom-4 right-4 items-end',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-left': 'bottom-4 left-4 items-start',
  };

  return (
    <div
      aria-label="Notifications"
      className={cn(
        'fixed z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0',
        positionClasses[position]
      )}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
