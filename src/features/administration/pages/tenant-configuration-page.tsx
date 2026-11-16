import React from 'react';
import { Sliders } from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { TenantConfigurationTabs } from '../components/configuration/tenant-configuration-tabs';
import { useToast } from '@/components/feedback/toast';
import {
  useTenantConfiguration,
  useUpdateTenantConfiguration,
  useSendTestEmail,
  useTestStorageConnection,
  useVerifyPaymentGateway,
} from '../hooks/use-admin';
import type {
  TenantSmtpConfig,
  TenantStorageConfig,
  TenantRazorpayConfig,
  TenantThemeConfig,
  SendTestEmailPayload,
} from '../types/admin.types';

export const TenantConfigurationPage: React.FC = () => {
  const toast = useToast();
  const { data: config, isLoading } = useTenantConfiguration();
  const updateMutation = useUpdateTenantConfiguration();
  const sendTestEmailMutation = useSendTestEmail();
  const testStorageMutation = useTestStorageConnection();
  const verifyRazorpayMutation = useVerifyPaymentGateway();

  if (isLoading || !config) {
    return (
      <PageWrapper className="space-y-6">
        <AdminPageHeader
          title="Tenant System Configuration & Integrations"
          subtitle="Configure SMTP mail server, S3 file storage, Razorpay gateway, and institutional branding."
          icon={Sliders}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Administration', href: '/admin' },
            { label: 'Configuration & Integrations' },
          ]}
        />
        <div className="h-64 rounded-2xl border border-border bg-surface flex items-center justify-center text-sm text-muted-foreground animate-pulse">
          Loading institutional tenant configuration...
        </div>
      </PageWrapper>
    );
  }

  const handleSaveSmtp = async (smtp: TenantSmtpConfig) => {
    try {
      await updateMutation.mutateAsync({
        organizationId: config.organizationId,
        payload: { smtp },
      });
      toast.success('SMTP email server configuration saved successfully', 'SMTP Configured');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save SMTP configuration';
      toast.error(msg, 'Configuration Error');
    }
  };

  const handleSaveStorage = async (storage: TenantStorageConfig) => {
    try {
      await updateMutation.mutateAsync({
        organizationId: config.organizationId,
        payload: { storage },
      });
      toast.success('Cloud document storage settings saved successfully', 'Storage Configured');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save storage settings';
      toast.error(msg, 'Configuration Error');
    }
  };

  const handleSaveRazorpay = async (razorpay: TenantRazorpayConfig) => {
    try {
      await updateMutation.mutateAsync({
        organizationId: config.organizationId,
        payload: { razorpay },
      });
      toast.success('Razorpay fee payment gateway settings saved successfully', 'Gateway Configured');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save Razorpay settings';
      toast.error(msg, 'Configuration Error');
    }
  };

  const handleSaveTheme = async (theme: TenantThemeConfig) => {
    try {
      await updateMutation.mutateAsync({
        organizationId: config.organizationId,
        payload: { theme },
      });
      toast.success('Institutional branding and theme preferences updated', 'Branding Saved');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save branding settings';
      toast.error(msg, 'Configuration Error');
    }
  };

  const handleTestStorage = async (storage: TenantStorageConfig) => {
    try {
      const res = await testStorageMutation.mutateAsync(storage);
      if (res.success) {
        toast.success(res.message, 'Storage Connection Verified');
      } else {
        toast.error(res.message, 'Storage Verification Failed');
      }
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Storage test failed';
      toast.error(msg, 'Storage Verification Failed');
      return { success: false, message: msg };
    }
  };

  const handleVerifyRazorpay = async (razorpay: TenantRazorpayConfig) => {
    try {
      const res = await verifyRazorpayMutation.mutateAsync(razorpay);
      if (res.success) {
        toast.success(res.message, 'Gateway Verified');
      } else {
        toast.error(res.message, 'Gateway Verification Failed');
      }
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment gateway verification failed';
      toast.error(msg, 'Gateway Verification Failed');
      return { success: false, message: msg };
    }
  };

  const handleSendTestEmail = async (payload: SendTestEmailPayload) => {
    try {
      const res = await sendTestEmailMutation.mutateAsync(payload);
      if (res.success) {
        toast.success(res.message, 'Test Email Sent');
      } else {
        toast.error(res.message, 'Test Email Failed');
      }
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send test email';
      toast.error(msg, 'Test Email Failed');
      return { success: false, message: msg, timestamp: new Date().toISOString() };
    }
  };

  return (
    <PageWrapper className="space-y-6">
      <AdminPageHeader
        title="Tenant System Configuration & Integrations"
        subtitle="Manage SMTP email servers, cloud document storage, Razorpay fees gateway, and institutional theme."
        icon={Sliders}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Administration', href: '/admin' },
          { label: 'Configuration & Integrations' },
        ]}
      />

      <TenantConfigurationTabs
        config={config}
        onSaveSmtp={handleSaveSmtp}
        onSaveStorage={handleSaveStorage}
        onSaveRazorpay={handleSaveRazorpay}
        onSaveTheme={handleSaveTheme}
        onTestStorage={handleTestStorage}
        onVerifyRazorpay={handleVerifyRazorpay}
        onSendTestEmail={handleSendTestEmail}
        isLoading={updateMutation.isPending}
      />
    </PageWrapper>
  );
};

