import React, { useEffect, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ToastNotification } from './toast-types';

export interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const remainingTimeRef = useRef<number>(toast.duration ?? 4000);
  const startTimeRef = useRef<number>(Date.now());

  const startTimer = () => {
    if (toast.duration === 0) return; // Sticky toast
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onDismiss(toast.id);
    }, remainingTimeRef.current);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    }
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id]);

  const typeConfig = {
    success: {
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />,
      border: 'border-emerald-500/30 dark:border-emerald-500/20',
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
      accent: 'bg-emerald-500',
    },
    error: {
      icon: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />,
      border: 'border-rose-500/30 dark:border-rose-500/20',
      badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
      accent: 'bg-rose-500',
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />,
      border: 'border-amber-500/30 dark:border-amber-500/20',
      badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
      accent: 'bg-amber-500',
    },
    info: {
      icon: <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />,
      border: 'border-blue-500/30 dark:border-blue-500/20',
      badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
      accent: 'bg-blue-500',
    },
  }[toast.type];

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      className={cn(
        'pointer-events-auto w-full max-w-sm rounded-xl border bg-surface p-4 shadow-xl shadow-black/5 transition-all duration-300',
        'relative overflow-hidden flex items-start gap-3.5',
        typeConfig.border
      )}
    >
      {/* Left indicator accent strip */}
      <div
        className={cn('absolute left-0 top-0 bottom-0 w-1', typeConfig.accent)}
      />

      {/* Semantic Icon */}
      {typeConfig.icon}

      {/* Content */}
      <div className="flex-1 min-w-0 pr-1">
        {toast.title && (
          <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-0.5">
            {toast.title}
          </h5>
        )}
        <div className="text-xs text-foreground/80 leading-relaxed break-words font-medium">
          {toast.message}
        </div>

        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action?.onClick();
              onDismiss(toast.id);
            }}
            className="mt-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Close notification"
        className="rounded-lg p-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
