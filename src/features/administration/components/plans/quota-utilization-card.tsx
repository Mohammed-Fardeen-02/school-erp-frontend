import React from 'react';
import { Sliders, AlertTriangle } from 'lucide-react';
import type { QuotaEntitlement } from '../../types/admin.types';

export interface QuotaUtilizationCardProps {
  quotas: QuotaEntitlement[];
}

export const QuotaUtilizationCard: React.FC<QuotaUtilizationCardProps> = ({ quotas }) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5 border-b border-border pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sliders className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">Capacity & Quota Utilization</h2>
          <p className="text-xs text-muted-foreground">
            Current system resource allocation against plan ceiling limits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quotas.map((q) => {
          const isHigh = q.percentage >= 80;

          return (
            <div key={q.key} className="rounded-xl border border-border bg-surface-muted/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{q.label}</span>
                {isHigh && <AlertTriangle className="h-3.5 w-3.5 text-warning" />}
              </div>

              <div className="flex items-baseline justify-between text-xs">
                <span className="text-lg font-bold text-foreground">{q.used.toLocaleString()}</span>
                <span className="text-muted-foreground">
                  of {q.total.toLocaleString()} {q.unit}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isHigh ? 'bg-warning' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(q.percentage, 100)}%` }}
                />
              </div>

              <p className="text-[10px] text-right text-muted-foreground font-semibold">
                {q.percentage}% Utilized
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

