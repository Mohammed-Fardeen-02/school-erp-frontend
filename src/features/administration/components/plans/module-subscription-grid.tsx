import React from 'react';
import { Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CanonicalModuleEntitlement } from '../../types/admin.types';

export interface ModuleSubscriptionGridProps {
  modules: CanonicalModuleEntitlement[];
  onToggleModule: (moduleId: string, enabled: boolean) => void;
  onSave: () => Promise<void>;
  isSaving?: boolean;
}

export const ModuleSubscriptionGrid: React.FC<ModuleSubscriptionGridProps> = ({
  modules,
  onToggleModule,
  onSave,
  isSaving,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">Subscribed Domain Modules</h2>
          <p className="text-xs text-muted-foreground">
            Activate or deactivate modular capabilities provisioned for this school tenant.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={onSave} disabled={isSaving}>
          {isSaving ? 'Updating...' : 'Save Module Subscriptions'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
              mod.isEnabled
                ? 'border-primary/30 bg-primary/5'
                : 'border-border bg-surface hover:bg-surface-muted/20 opacity-80'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div
                className={`p-2 rounded-lg mt-0.5 ${
                  mod.isEnabled ? 'bg-primary text-white' : 'bg-surface-muted text-muted-foreground'
                }`}
              >
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-foreground">{mod.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{mod.description}</p>
                <span className="text-[10px] uppercase font-bold text-muted-foreground/80 mt-1 inline-block">
                  {mod.category}
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={mod.isEnabled}
                onChange={(e) => onToggleModule(mod.id, e.target.checked)}
                disabled={mod.isLockedByPlan}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-surface-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
