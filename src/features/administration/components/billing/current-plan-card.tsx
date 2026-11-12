import React from 'react';
import { CreditCard, Check, ArrowUpRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/data-display/badge';
import type { SubscriptionOverview } from '../../types/admin.types';

export interface CurrentPlanCardProps {
  overview: SubscriptionOverview;
  onUpgradeClick?: () => void;
}

export const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({ overview, onUpgradeClick }) => {
  const plan = overview.currentPlan;

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-muted/50 p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-foreground">{plan.name}</h2>
            <Badge variant="success">Active Plan</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
        </div>

        {onUpgradeClick && (
          <Button
            variant="primary"
            size="sm"
            onClick={onUpgradeClick}
            icon={<ArrowUpRight className="h-4 w-4" />}
          >
            Upgrade Plan
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-border py-4">
        <div>
          <p className="text-xs text-muted-foreground">Renewal Amount & Term</p>
          <p className="text-lg font-bold text-foreground">
            ${overview.nextRenewalAmount}
            <span className="text-xs text-muted-foreground font-normal"> / {overview.billingCycle.toLowerCase()}</span>
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Next Renewal Date</p>
          <p className="text-sm font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
            <Calendar className="h-4 w-4 text-primary" />
            {new Date(overview.currentPeriodEnd).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Billing Payment Method</p>
          <p className="text-sm font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
            <CreditCard className="h-4 w-4 text-primary" />
            {overview.paymentMethod.brand} •••• {overview.paymentMethod.last4}
          </p>
        </div>
      </div>

      {/* Plan Features Checklist */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Included Entitlements & Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {plan.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-foreground font-medium">
              <Check className="h-4 w-4 text-success shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
