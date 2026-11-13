import React, { useState } from 'react';
import { Lock, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Select } from '@/components/forms/select';
import { Checkbox } from '@/components/forms/checkbox';
import type { SecurityPolicyConfig } from '../../types/admin.types';

export interface SecurityPoliciesCardProps {
  initialPolicies: SecurityPolicyConfig;
  onSave: (policies: SecurityPolicyConfig) => Promise<void>;
  isLoading?: boolean;
}

export const SecurityPoliciesCard: React.FC<SecurityPoliciesCardProps> = ({
  initialPolicies,
  onSave,
  isLoading,
}) => {
  const [policies, setPolicies] = useState<SecurityPolicyConfig>(initialPolicies);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(policies);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Password & Access Policies</h2>
            <p className="text-xs text-muted-foreground">
              Enforce enterprise security standards across institutional logins.
            </p>
          </div>
        </div>
        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-success animate-in fade-in">
            <Check className="h-4 w-4" /> Policies Saved
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password Complexity */}
        <div className="space-y-4 rounded-xl border border-border p-4 bg-surface-muted/20">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Password Complexity Rules
          </h3>

          <Input
            label="Minimum Password Length"
            type="number"
            min={8}
            max={32}
            value={policies.minPasswordLength}
            onChange={(e) =>
              setPolicies((p) => ({ ...p, minPasswordLength: Number(e.target.value) }))
            }
          />

          <div className="space-y-2 pt-2">
            <Checkbox
              label="Require at least one uppercase letter (A-Z)"
              checked={policies.requireUppercase}
              onCheckedChange={(checked) =>
                setPolicies((p) => ({ ...p, requireUppercase: !!checked }))
              }
            />
            <Checkbox
              label="Require at least one number (0-9)"
              checked={policies.requireNumbers}
              onCheckedChange={(checked) =>
                setPolicies((p) => ({ ...p, requireNumbers: !!checked }))
              }
            />
            <Checkbox
              label="Require special characters (!@#$%^&*)"
              checked={policies.requireSpecialChars}
              onCheckedChange={(checked) =>
                setPolicies((p) => ({ ...p, requireSpecialChars: !!checked }))
              }
            />
          </div>
        </div>

        {/* Session & Lockout */}
        <div className="space-y-4 rounded-xl border border-border p-4 bg-surface-muted/20">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Session & Lockout Thresholds
          </h3>

          <Select
            label="Session Idle Timeout"
            value={String(policies.sessionTimeoutMinutes)}
            onChange={(e) =>
              setPolicies((p) => ({ ...p, sessionTimeoutMinutes: Number(e.target.value) }))
            }
          >
            <option value="15">15 Minutes of Inactivity</option>
            <option value="30">30 Minutes of Inactivity</option>
            <option value="60">1 Hour of Inactivity</option>
            <option value="480">8 Hours (Full School Day)</option>
          </Select>

          <Select
            label="Account Lockout on Failed Logins"
            value={String(policies.maxFailedLoginsBeforeLockout)}
            onChange={(e) =>
              setPolicies((p) => ({
                ...p,
                maxFailedLoginsBeforeLockout: Number(e.target.value),
              }))
            }
          >
            <option value="3">3 Consecutive Failures</option>
            <option value="5">5 Consecutive Failures (Recommended)</option>
            <option value="10">10 Consecutive Failures</option>
          </Select>

          <Select
            label="Two-Factor Authentication (MFA)"
            value={policies.twoFactorPolicy}
            onChange={(e) =>
              setPolicies((p) => ({
                ...p,
                twoFactorPolicy: e.target.value as SecurityPolicyConfig['twoFactorPolicy'],
              }))
            }
          >
            <option value="OPTIONAL">Optional for all users</option>
            <option value="ADMIN_ONLY">Enforced for Administrators</option>
            <option value="MANDATORY">Mandatory for all institutional accounts</option>
          </Select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button variant="primary" size="sm" type="submit" disabled={isLoading} icon={<Save className="h-4 w-4" />}>
          Save Security Policies
        </Button>
      </div>
    </form>
  );
};
