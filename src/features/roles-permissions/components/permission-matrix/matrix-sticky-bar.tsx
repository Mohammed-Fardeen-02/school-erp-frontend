import * as React from 'react';
import { Save, RotateCcw, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MatrixStickyBarProps {
  dirtyCount: number;
  grantsCount: number;
  deniesCount: number;
  resetsCount: number;
  isSaving?: boolean;
  onDiscard: () => void;
  onSave: () => void;
}

export const MatrixStickyBar: React.FC<MatrixStickyBarProps> = ({
  dirtyCount,
  grantsCount,
  deniesCount,
  resetsCount,
  isSaving = false,
  onDiscard,
  onSave,
}) => {
  if (dirtyCount === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-3xl rounded-2xl border border-primary/30 bg-surface/95 backdrop-blur-md p-4 shadow-2xl animate-in slide-in-from-bottom-6 duration-200"
      data-testid="matrix-sticky-bar"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">Unsaved Changes:</span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {dirtyCount} modified rule{dirtyCount > 1 ? 's' : ''}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground flex gap-2">
              {grantsCount > 0 && (
                <span className="text-emerald-600 font-medium">+{grantsCount} explicit grants</span>
              )}
              {deniesCount > 0 && (
                <span className="text-rose-600 font-medium">+{deniesCount} explicit denies</span>
              )}
              {resetsCount > 0 && (
                <span className="text-blue-600 font-medium">+{resetsCount} resets</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDiscard}
            disabled={isSaving}
            icon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            Discard Changes
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            icon={isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          >
            {isSaving ? 'Saving Capabilities...' : 'Save Matrix'}
          </Button>
        </div>
      </div>
    </div>
  );
};
