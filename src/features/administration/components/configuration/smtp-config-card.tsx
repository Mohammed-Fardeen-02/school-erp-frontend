import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertTriangle, Send, ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Select } from '@/components/forms/select';
import type { TenantSmtpConfig, SmtpSecurityMode } from '../../types/admin.types';

export interface SmtpConfigCardProps {
  initialConfig: TenantSmtpConfig;
  onSave: (config: TenantSmtpConfig) => Promise<void>;
  onOpenTestModal: () => void;
  isLoading?: boolean;
}

export const SmtpConfigCard: React.FC<SmtpConfigCardProps> = ({
  initialConfig,
  onSave,
  onOpenTestModal,
  isLoading = false,
}) => {
  const [config, setConfig] = useState<TenantSmtpConfig>(initialConfig);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);
    const updated = {
      ...config,
      ...(password ? { password, isPasswordSet: true } : {}),
      port: Number(config.port) || 587,
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
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">SMTP Outgoing Mail Server</h2>
              {config.isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Active & Verified</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Inactive</span>
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Deliver invitations, welcome credentials, and reset emails from your own domain address.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenTestModal}
            icon={<Send className="h-3.5 w-3.5 text-blue-600" />}
            className="text-xs h-9"
          >
            Send Test Email
          </Button>
        </div>
      </div>

      {isSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in-0">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>SMTP configuration saved and verified successfully!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <Input
              label="SMTP Host / Server Address"
              placeholder="e.g. smtp.gmail.com or email-smtp.us-east-1.amazonaws.com"
              value={config.host}
              onChange={(e) => setConfig({ ...config, host: e.target.value })}
              required
            />
          </div>

          <div className="md:col-span-3">
            <Input
              label="Port"
              type="number"
              placeholder="587"
              value={String(config.port)}
              onChange={(e) => setConfig({ ...config, port: Number(e.target.value) })}
              required
            />
          </div>

          <div className="md:col-span-3">
            <Select
              label="Encryption Security"
              value={config.security}
              onChange={(e) => setConfig({ ...config, security: e.target.value as SmtpSecurityMode })}
            >
              <option value="STARTTLS">STARTTLS (Port 587)</option>
              <option value="SSL_TLS">SSL / TLS (Port 465)</option>
              <option value="NONE">None (Port 25)</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="SMTP Username / Account"
            placeholder="e.g. notifications@greenwood.edu or API Key ID"
            value={config.username || ''}
            onChange={(e) => setConfig({ ...config, username: e.target.value })}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              SMTP Password / App Secret
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={config.isPasswordSet ? '•••••••••••• (Leave blank to keep existing)' : 'Enter SMTP password...'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-9 px-3 pr-10 text-xs bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {config.isPasswordSet && !password && (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Lock className="h-3 w-3 text-emerald-600" />
                <span>Encrypted credential is securely configured.</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border">
          <Input
            label="From Email Address"
            type="email"
            placeholder="e.g. no-reply@greenwood.edu"
            value={config.fromAddress}
            onChange={(e) => setConfig({ ...config, fromAddress: e.target.value })}
            helperText="Matches your verified domain for SPF/DKIM alignment"
            required
          />

          <Input
            label="Sender Display Name"
            placeholder="e.g. Greenwood International Academy"
            value={config.fromName}
            onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
            required
          />

          <Input
            label="Reply-To Address (Optional)"
            type="email"
            placeholder="e.g. admissions@greenwood.edu"
            value={config.replyTo || ''}
            onChange={(e) => setConfig({ ...config, replyTo: e.target.value })}
          />
        </div>

        {/* Enable Custom SMTP Toggle */}
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.isActive}
              onChange={(e) => setConfig({ ...config, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
            />
            <span className="text-xs font-semibold text-foreground">
              Enable custom SMTP mail server for this institution
            </span>
          </label>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isLoading}
            icon={<ShieldCheck className="h-4 w-4" />}
            className="text-xs h-9 font-bold"
          >
            {isLoading ? 'Saving...' : 'Save SMTP Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

