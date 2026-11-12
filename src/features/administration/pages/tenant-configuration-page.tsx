import React from 'react';
import { Sliders } from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { TenantConfigurationTabs } from '../components/configuration/tenant-configuration-tabs';
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
    await updateMutation.mutateAsync({
      organizationId: config.organizationId,
      payload: { smtp },
    });
  };

  const handleSaveStorage = async (storage: TenantStorageConfig) => {
    await updateMutation.mutateAsync({
      organizationId: config.organizationId,
      payload: { storage },
    });
  };

  const handleSaveRazorpay = async (razorpay: TenantRazorpayConfig) => {
    await updateMutation.mutateAsync({
      organizationId: config.organizationId,
      payload: { razorpay },
    });
  };

  const handleSaveTheme = async (theme: TenantThemeConfig) => {
    await updateMutation.mutateAsync({
      organizationId: config.organizationId,
      payload: { theme },
    });
  };

  const handleTestStorage = async (storage: TenantStorageConfig) => {
    return await testStorageMutation.mutateAsync(storage);
  };

  const handleVerifyRazorpay = async (razorpay: TenantRazorpayConfig) => {
    return await verifyRazorpayMutation.mutateAsync(razorpay);
  };

  const handleSendTestEmail = async (payload: SendTestEmailPayload) => {
    return await sendTestEmailMutation.mutateAsync(payload);
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

