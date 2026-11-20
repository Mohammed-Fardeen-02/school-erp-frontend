import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export type DrawerWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: DrawerWidth | string;
  position?: 'right' | 'left';
  className?: string;
}

const WIDTH_MAP: Record<DrawerWidth, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full',
};

/**
 * Standard ERP Drawer Component
 * Accessible slide-over panel for inspect/view workflows and quick forms.
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'md',
  position = 'right',
  className = '',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const widthClass = WIDTH_MAP[width as DrawerWidth] || width;
  const isRight = position === 'right';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        data-testid="drawer-backdrop"
      />

      <div
        className={`fixed inset-y-0 ${
          isRight ? 'right-0 pl-10' : 'left-0 pr-10'
        } flex max-w-full`}
      >
        <div
          ref={drawerRef}
          className={`w-screen ${widthClass} bg-surface shadow-2xl flex flex-col border-${
            isRight ? 'l' : 'r'
          } border-border animate-in ${
            isRight ? 'slide-in-from-right' : 'slide-in-from-left'
          } duration-200 ${className}`.trim()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-muted/20">
            <div className="min-w-0 pr-4">
              <h2 id="drawer-title" className="text-base font-bold text-foreground truncate">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">{children}</div>

          {/* Action Footer */}
          {footer && (
            <div className="border-t border-border px-6 py-4 bg-surface-muted/30 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

