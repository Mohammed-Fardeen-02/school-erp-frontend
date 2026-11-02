import * as React from 'react';
import { useEffect } from 'react';
import { X, Sliders, Shield } from 'lucide-react';
import { PermissionMatrixBuilder } from './permission-matrix-builder';
import type { RoleSummary } from '../../types/roles.types';

export interface RoleMatrixModalProps {
  isOpen: boolean;
  role: RoleSummary | null;
  onClose: () => void;
}

export const RoleMatrixModal: React.FC<RoleMatrixModalProps> = ({
  isOpen,
  role,
  onClose,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !role) return null;

  const isTemplate = role.roleType === 'SYSTEM_TEMPLATE';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-matrix-modal-title"
      data-testid="role-matrix-modal"
    >
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="role-matrix-modal-title"
                  className="text-base font-bold text-foreground"
                >
                  Capability Matrix: {role.roleName}
                </h3>
                <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground border border-border">
                  {role.roleCode}
                </code>
                {isTemplate ? (
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full dark:bg-purple-950/40 dark:text-purple-300">
                    System Template (Read-Only)
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full dark:bg-blue-950/40 dark:text-blue-300">
                    Custom Role
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isTemplate
                  ? 'Baseline immutable permission profile defined by the platform'
                  : 'Tailor granular capability overrides and module inheritance for this tenant'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close capability matrix"
            className="rounded-lg p-2 text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scrollable Canvas Content */}
        <div className="flex-1 overflow-y-auto bg-surface-muted/20">
          <PermissionMatrixBuilder
            roleId={role.id}
            roleName={role.roleName}
            roleCode={role.roleCode}
            isReadOnly={isTemplate}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};
