import * as React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { AlertTriangle, X, Loader2, Info } from 'lucide-react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  itemName?: string;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  itemName,
  loading = false,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}) => {
  const isDanger = variant === 'danger';
  const isWarning = variant === 'warning';

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={open => !open && onCancel()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 border border-border bg-surface p-6 shadow-xl shadow-black/10 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                isDanger
                  ? 'bg-danger/10 text-danger'
                  : isWarning
                    ? 'bg-warning/10 text-warning'
                    : 'bg-primary/10 text-primary'
              }`}
            >
              {variant === 'info' ? (
                <Info className="h-6 w-6" aria-hidden="true" />
              ) : (
                <AlertTriangle className="h-6 w-6" aria-hidden="true" />
              )}
            </div>
            <div className="flex-1">
              <AlertDialog.Title className="text-lg font-semibold text-foreground">
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
                {description}
                {itemName && (
                  <span className="mt-1 block font-medium text-foreground">"{itemName}"</span>
                )}
              </AlertDialog.Description>
            </div>
          </div>
          <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                disabled={loading}
                onClick={onCancel}
                className="mt-2 inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 sm:mt-0"
              >
                {cancelText}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                disabled={loading}
                onClick={e => {
                  e.preventDefault();
                  onConfirm();
                }}
                className={`inline-flex h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                  isDanger
                    ? 'bg-danger hover:bg-danger/90 focus:ring-danger'
                    : isWarning
                      ? 'bg-warning hover:bg-warning/90 focus:ring-warning'
                      : 'bg-primary hover:bg-primary-dark focus:ring-primary'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </AlertDialog.Action>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Close</span>
          </button>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
