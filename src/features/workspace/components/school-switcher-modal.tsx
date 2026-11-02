import * as React from 'react';
import { Building2, Check, X, Shield } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { Badge } from '@/components/data-display/badge';

export interface SchoolSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchoolSwitcherModal: React.FC<SchoolSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { workspaces, activeWorkspaceId, setActiveWorkspace } = useAuthStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Switch School Workspace</h3>
              <p className="text-xs text-muted-foreground">Select an institutional workspace to manage</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* List of Schools */}
        <div className="mt-4 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {workspaces.map(ws => {
            const isActive = ws.id === activeWorkspaceId;
            return (
              <div
                key={ws.id}
                onClick={() => {
                  setActiveWorkspace(ws.id);
                  onClose();
                }}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                  isActive
                    ? 'border-primary bg-primary/5 shadow-xs'
                    : 'border-border bg-surface hover:border-primary/40 hover:bg-surface-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      isActive ? 'bg-primary text-white' : 'bg-surface-muted text-foreground'
                    }`}
                  >
                    {ws.code.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{ws.name}</span>
                      {isActive && <Badge variant="primary" className="text-[10px]">Active</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{ws.campusName || 'Main Campus'}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Shield className="h-3 w-3 text-primary" />
                        {ws.role.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {isActive ? (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="h-4 w-4" />
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-primary">Switch →</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
