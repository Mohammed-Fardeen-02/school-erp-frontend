import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertTriangle, ShieldCheck, Lock, Eye, EyeOff, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Select } from '@/components/forms/select';
import type { TenantRazorpayConfig } from '../../types/admin.types';

export interface RazorpayConfigCardProps {
  initialConfig: TenantRazorpayConfig;
  onSave: (config: TenantRazorpayConfig) => Promise<void>;
  onVerify: (config: TenantRazorpayConfig) => Promise<{ success: boolean; message: string }>;
  isLoading?: boolean;
}

export const RazorpayConfigCard: React.FC<RazorpayConfigCardProps> = ({
  initialConfig,
  onSave,
  onVerify,
  isLoading = false,
}) => {
  const [config, setConfig] = useState<TenantRazorpayConfig>(initialConfig);
  const [keySecret, setKeySecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerifyResult(null);
    try {
      const res = await onVerify({
        ...config,
        ...(keySecret ? { keySecret, isSecretSet: true } : {}),
      });
      setVerifyResult(res);
    } catch (err: any) {
      setVerifyResult({
        success: false,
        message: err?.message || 'Razorpay authentication failed. Verify Key ID and Secret.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);
    const updated = {
      ...config,
      ...(keySecret ? { keySecret, isSecretSet: true } : {}),
    };
    await onSave(updated);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">Razorpay Payment Gateway</h2>
              {config.isEnabled ? (
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  config.mode === 'LIVE'
                    ? 'bg-emerald-500/10 text-emerald-700'
                    : 'bg-amber-500/10 text-amber-700'
                }`}>
                  <Zap className="h-3 w-3" />
                  <span>{config.mode === 'LIVE' ? 'Production Live' : 'Sandbox Test Mode'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  <span>Disabled</span>
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Collect student fees, tuition installments, and digital receipts seamlessly via UPI, Cards, and Netbanking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleVerify}
            disabled={isVerifying || !config.keyId}
            icon={<ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />}
            className="text-xs h-9"
          >
            {isVerifying ? 'Verifying...' : 'Verify Gateway'}
          </Button>
        </div>
      </div>

      {verifyResult && (
        <div
          className={`rounded-xl border p-3 text-xs flex items-center gap-2 animate-in fade-in-0 ${
            verifyResult.success
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800'
              : 'border-red-500/30 bg-red-500/10 text-red-800'
          }`}
        >
          {verifyResult.success ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{verifyResult.message}</span>
        </div>
      )}

      {isSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in-0">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Razorpay gateway configuration saved successfully!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Environment Selection Toggle */}
        <div className="rounded-xl border border-border p-3.5 bg-surface-muted/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-foreground">Operational Gateway Mode</div>
            <p className="text-[11px] text-muted-foreground">
              Select Sandbox Test Mode to simulate fee payments or Production Live to process real transactions.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1 shrink-0">
            <button
              type="button"
              onClick={() => setConfig({ ...config, mode: 'TEST' })}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                config.mode === 'TEST'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sandbox Test Mode
            </button>
            <button
              type="button"
              onClick={() => setConfig({ ...config, mode: 'LIVE' })}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                config.mode === 'LIVE'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Production Live
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Razorpay Key ID"
            placeholder={config.mode === 'LIVE' ? 'rzp_live_...' : 'rzp_test_...'}
            value={config.keyId}
            onChange={(e) => setConfig({ ...config, keyId: e.target.value })}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Razorpay Key Secret
            </label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                placeholder={config.isSecretSet ? '•••••••••••••••• (Leave blank to keep existing)' : 'Enter Key Secret...'}
                value={keySecret}
                onChange={(e) => setKeySecret(e.target.value)}
                className="w-full h-9 px-3 pr-10 text-xs bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showSecret ? 'Hide key secret' : 'Show key secret'}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {config.isSecretSet && !keySecret && (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Lock className="h-3 w-3 text-emerald-600" />
                <span>API secret is securely stored and encrypted.</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border">
          <Input
            label="Webhook Secret (Optional)"
            placeholder="e.g. whsec_..."
            value={config.webhookSecret || ''}
            onChange={(e) => setConfig({ ...config, webhookSecret: e.target.value })}
            helperText="Verifies cryptographic HMAC-SHA256 signatures on payment webhooks"
          />

          <Input
            label="Merchant Display Name"
            placeholder="e.g. Greenwood Academy Fees"
            value={config.merchantDisplayName || ''}
            onChange={(e) => setConfig({ ...config, merchantDisplayName: e.target.value })}
            helperText="Brand title displayed inside the student payment modal"
          />

          <Select
            label="Settlement Currency"
            value={config.currency}
            onChange={(e) => setConfig({ ...config, currency: e.target.value })}
          >
            <option value="INR">INR (₹ - Indian Rupee)</option>
            <option value="USD">USD ($ - US Dollar)</option>
            <option value="AED">AED (د.إ - UAE Dirham)</option>
            <option value="GBP">GBP (£ - British Pound)</option>
            <option value="EUR">EUR (€ - Euro)</option>
          </Select>
        </div>

        {/* Behavior Toggles */}
        <div className="pt-2 border-t border-border space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.autoCapture}
              onChange={(e) => setConfig({ ...config, autoCapture: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
            />
            <span className="text-xs font-semibold text-foreground">
              Auto-capture payments immediately (Recommended for student fee payments)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.generateInvoicesOnSuccess}
              onChange={(e) => setConfig({ ...config, generateInvoicesOnSuccess: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
            />
            <span className="text-xs font-semibold text-foreground">
              Automatically generate official invoice receipt PDF upon transaction settlement
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.isEnabled}
              onChange={(e) => setConfig({ ...config, isEnabled: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
            />
            <span className="text-xs font-semibold text-foreground">
              Enable Razorpay payments for this educational tenant
            </span>
          </label>
        </div>

        <div className="pt-2 border-t border-border flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isLoading}
            className="text-xs h-9 font-bold"
          >
            {isLoading ? 'Saving...' : 'Save Payment Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};
