import React, { useState } from 'react';
import { Mail, HardDrive, CreditCard, Palette, FileText } from 'lucide-react';
import { SmtpConfigCard } from './smtp-config-card';
import { StorageConfigCard } from './storage-config-card';
import { RazorpayConfigCard } from './razorpay-config-card';
import { ThemeBrandingCard } from './theme-branding-card';
import { EmailTemplatesGallery } from './email-templates-gallery';
import { SendTestEmailModal } from './send-test-email-modal';
import type {
  TenantConfigurationDto,
  TenantSmtpConfig,
  TenantStorageConfig,
  TenantRazorpayConfig,
  TenantThemeConfig,
  EmailTemplateType,
  SendTestEmailPayload,
} from '../../types/admin.types';

export interface TenantConfigurationTabsProps {
  config: TenantConfigurationDto;
  onSaveSmtp: (smtp: TenantSmtpConfig) => Promise<void>;
  onSaveStorage: (storage: TenantStorageConfig) => Promise<void>;
  onSaveRazorpay: (razorpay: TenantRazorpayConfig) => Promise<void>;
  onSaveTheme: (theme: TenantThemeConfig) => Promise<void>;
  onTestStorage: (storage: TenantStorageConfig) => Promise<{ success: boolean; message: string }>;
  onVerifyRazorpay: (razorpay: TenantRazorpayConfig) => Promise<{ success: boolean; message: string }>;
  onSendTestEmail: (payload: SendTestEmailPayload) => Promise<{ success: boolean; message: string; timestamp: string }>;
  isLoading?: boolean;
}

export type ConfigTabKey = 'smtp' | 'storage' | 'razorpay' | 'theme' | 'templates';

export const TenantConfigurationTabs: React.FC<TenantConfigurationTabsProps> = ({
  config,
  onSaveSmtp,
  onSaveStorage,
  onSaveRazorpay,
  onSaveTheme,
  onTestStorage,
  onVerifyRazorpay,
  onSendTestEmail,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<ConfigTabKey>('smtp');
  const [isTestEmailOpen, setIsTestEmailOpen] = useState(false);
  const [testEmailTemplate, setTestEmailTemplate] = useState<EmailTemplateType>('USER_INVITATION');

  const tabs: { key: ConfigTabKey; label: string; icon: React.ElementType; badge?: string }[] = [
    { key: 'smtp', label: 'SMTP Mail Server', icon: Mail, badge: config.smtp.isActive ? 'Active' : undefined },
    { key: 'storage', label: 'File Storage', icon: HardDrive, badge: config.storage.provider },
    { key: 'razorpay', label: 'Razorpay Gateway', icon: CreditCard, badge: config.razorpay.mode },
    { key: 'theme', label: 'Theme & Branding', icon: Palette },
    { key: 'templates', label: 'Email Templates', icon: FileText, badge: '4 Templates' },
  ];

  const handleOpenTestModal = (templateType: EmailTemplateType = 'USER_INVITATION') => {
    setTestEmailTemplate(templateType);
    setIsTestEmailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-muted/60 text-muted-foreground hover:bg-surface-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-surface text-muted-foreground border border-border'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'smtp' && (
          <SmtpConfigCard
            initialConfig={config.smtp}
            onSave={onSaveSmtp}
            onOpenTestModal={() => handleOpenTestModal('USER_INVITATION')}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'storage' && (
          <StorageConfigCard
            initialConfig={config.storage}
            onSave={onSaveStorage}
            onTestConnection={onTestStorage}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'razorpay' && (
          <RazorpayConfigCard
            initialConfig={config.razorpay}
            onSave={onSaveRazorpay}
            onVerify={onVerifyRazorpay}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'theme' && (
          <ThemeBrandingCard
            initialConfig={config.theme}
            onSave={onSaveTheme}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'templates' && (
          <EmailTemplatesGallery
            themeConfig={config.theme}
            onOpenTestModal={handleOpenTestModal}
          />
        )}
      </div>

      {/* Diagnostic Send Test Email Modal */}
      <SendTestEmailModal
        isOpen={isTestEmailOpen}
        onClose={() => setIsTestEmailOpen(false)}
        onSend={onSendTestEmail}
        defaultTemplate={testEmailTemplate}
      />
    </div>
  );
};
