import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Select } from '@/components/forms/select';
import type { EmailTemplateType, SendTestEmailPayload } from '../../types/admin.types';

export interface SendTestEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (payload: SendTestEmailPayload) => Promise<{ success: boolean; message: string; timestamp: string }>;
  defaultTemplate?: EmailTemplateType;
}

export const SendTestEmailModal: React.FC<SendTestEmailModalProps> = ({
  isOpen,
  onClose,
  onSend,
  defaultTemplate = 'USER_INVITATION',
}) => {
  const [toEmail, setToEmail] = useState('');
  const [templateType, setTemplateType] = useState<EmailTemplateType>(defaultTemplate);
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; timestamp: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail) return;

    setIsSending(true);
    setResult(null);

    try {
      const res = await onSend({
        toEmail: toEmail.trim(),
        templateType,
      });
      setResult(res);
    } catch (err: any) {
      setResult({
        success: false,
        message: err?.message || 'Failed to dispatch test email. Please verify SMTP host and credentials.',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Send Diagnostic Test Email</h2>
              <p className="text-xs text-muted-foreground">
                Verify deliverability and inbox rendering using your configured SMTP server.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {result && (
            <div
              className={`rounded-xl border p-3.5 text-xs flex items-start gap-2.5 animate-in fade-in-0 ${
                result.success
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300'
                  : 'border-red-500/30 bg-red-500/10 text-red-900 dark:text-red-300'
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{result.message}</p>
                <span className="text-[10px] text-muted-foreground block mt-1">
                  Timestamp: {new Date(result.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}

          <Input
            label="Recipient Destination Email"
            type="email"
            placeholder="e.g. test@yourdomain.com or your personal email"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            helperText="We will transmit a sample email payload to this address"
            required
            autoFocus
          />

          <Select
            label="Template Sample to Deliver"
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value as EmailTemplateType)}
          >
            <option value="USER_INVITATION">User Invitation & Onboarding</option>
            <option value="ORG_WELCOME">Organization Welcome & Credentials</option>
            <option value="PASSWORD_RESET">Password Reset & Security Code</option>
            <option value="EMAIL_VERIFICATION">Email Address Verification</option>
          </Select>

          <div className="rounded-xl border border-border p-3 bg-surface-muted/30 text-xs text-muted-foreground flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-blue-600 shrink-0" />
            <span>
              Test emails are dispatched using your current SMTP server settings and active institutional branding.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSending}>
              Close
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSending || !toEmail}
              icon={<Send className="h-4 w-4" />}
              className="font-bold text-xs h-9"
            >
              {isSending ? 'Transmitting...' : 'Dispatch Test Email'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

