import React, { useState } from 'react';
import { Lock, Save, Check, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5" /> Password Complexity Rules
          </h3>

          <Input
            label="Minimum Password Length"
            type="number"
            min={8}
            max={32}
            value={policies.minPasswordLength}
            onChange={(e) =>
              setPolicies((p) => ({ ...p, minPasswordLength: Math.max(8, Number(e.target.value)) }))
            }
          />

          <Select
            label="Password Expiration Cycle"
            value={String(policies.passwordExpiryDays ?? 90)}
            onChange={(e) =>
              setPolicies((p) => ({ ...p, passwordExpiryDays: Number(e.target.value) }))
            }
          >
            <option value="0">Never Expires</option>
            <option value="30">Every 30 Days</option>
            <option value="60">Every 60 Days</option>
            <option value="90">Every 90 Days (Quarterly Recommended)</option>
            <option value="180">Every 180 Days (Half-Yearly)</option>
            <option value="365">Every 365 Days (Annual)</option>
          </Select>

          <div className="space-y-2 pt-2 border-t border-border/50">
            <Checkbox
              label="Require at least one uppercase letter (A-Z)"
              checked={policies.requireUppercase}
              onCheckedChange={(checked) =>
                setPolicies((p) => ({ ...p, requireUppercase: !!checked }))
              }
            />
            <Checkbox
              label="Require at least one lowercase letter (a-z)"
              checked={policies.requireLowercase ?? true}
              onCheckedChange={(checked) =>
                setPolicies((p) => ({ ...p, requireLowercase: !!checked }))
              }
            />
            <Checkbox
              label="Require at least one numeric digit (0-9)"
              checked={policies.requireNumbers}
              onCheckedChange={(checked) =>
                setPolicies((p) => ({ ...p, requireNumbers: !!checked }))
              }
            />
            <Checkbox
              label="Require special characters (!@#$%^&*...)"
              checked={policies.requireSpecialChars}
              onCheckedChange={(checked) =>
                setPolicies((p) => ({ ...p, requireSpecialChars: !!checked }))
              }
            />
          </div>
        </div>

        {/* Session & Lockout */}
        <div className="space-y-4 rounded-xl border border-border p-4 bg-surface-muted/20">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> Session & Lockout Thresholds
          </h3>

          <Select
            label="Session Idle Timeout"
            value={String(policies.sessionTimeoutMinutes)}
            onChange={(e) =>
              setPolicies((p) => ({ ...p, sessionTimeoutMinutes: Number(e.target.value) }))
            }
          >
            <option value="15">15 Minutes of Inactivity</option>
            <option value="30">30 Minutes of Inactivity (Recommended)</option>
            <option value="60">1 Hour of Inactivity</option>
            <option value="120">2 Hours of Inactivity</option>
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
            label="Lockout Duration"
            value={String(policies.lockoutDurationMinutes ?? 15)}
            onChange={(e) =>
              setPolicies((p) => ({
                ...p,
                lockoutDurationMinutes: Number(e.target.value),
              }))
            }
          >
            <option value="5">5 Minutes</option>
            <option value="15">15 Minutes (Recommended)</option>
            <option value="30">30 Minutes</option>
            <option value="60">1 Hour</option>
          </Select>

          <div className="space-y-1.5">
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
              <option value="ADMIN_ONLY" disabled>
                Enforced for Administrators [Planned — Requires TOTP Engine Setup]
              </option>
              <option value="MANDATORY" disabled>
                Mandatory for all institutional accounts [Planned — Requires TOTP Engine Setup]
              </option>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Institutional MFA enforcement (Admin-only and Mandatory) is restricted pending TOTP authenticator engine rollout.
            </p>
          </div>
        </div>
      </div>

      {/* Policy Preview Summary */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-foreground flex items-start gap-2.5">
        <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <div>
          <span className="font-bold">Active Enforcement Summary:</span> Passwords must be at least{' '}
          <span className="font-semibold">{policies.minPasswordLength}</span> characters long, containing{' '}
          {policies.requireUppercase ? 'uppercase, ' : ''}
          {policies.requireNumbers ? 'numbers, ' : ''}
          {policies.requireSpecialChars ? 'symbols, ' : ''}
          and sessions will auto-lock after{' '}
          <span className="font-semibold">{policies.sessionTimeoutMinutes} minutes</span> of inactivity.
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
