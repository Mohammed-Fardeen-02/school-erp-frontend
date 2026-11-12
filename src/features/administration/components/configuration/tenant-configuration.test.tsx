import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TenantConfigurationTabs } from './tenant-configuration-tabs';
import type { TenantConfigurationDto } from '../../types/admin.types';

const mockInitialConfig: TenantConfigurationDto = {
  organizationId: 'org_test_123',
  smtp: {
    host: 'smtp.testmail.com',
    port: 587,
    security: 'STARTTLS',
    username: 'test-user',
    isPasswordSet: true,
    fromAddress: 'no-reply@testschool.edu',
    fromName: 'Test Academy',
    replyTo: 'support@testschool.edu',
    isActive: true,
    lastVerifiedAt: '2026-11-12T10:00:00Z',
  },
  storage: {
    provider: 'AWS_S3',
    bucket: 'test-documents',
    region: 'ap-south-1',
    accessKeyId: 'AKIA_TEST_KEY',
    isSecretSet: true,
    cdnCustomDomain: 'https://cdn.testschool.edu',
    maxUploadSizeMb: 25,
    allowedExtensions: ['.pdf', '.jpg', '.png'],
    isActive: true,
  },
  razorpay: {
    isEnabled: true,
    mode: 'TEST',
    keyId: 'rzp_test_mock123',
    isSecretSet: true,
    webhookSecret: 'whsec_test',
    merchantDisplayName: 'Test Academy Fees',
    currency: 'INR',
    autoCapture: true,
    generateInvoicesOnSuccess: true,
  },
  theme: {
    institutionName: 'Test Academy',
    primaryColor: '#2563eb',
    accentColor: '#f59e0b',
    tagline: 'Empowering Minds',
    emailSignature: 'Test Academy • Main Campus',
    defaultTheme: 'SYSTEM',
  },
  updatedAt: '2026-11-12T10:00:00Z',
};

function renderTabs(overrides?: Partial<React.ComponentProps<typeof TenantConfigurationTabs>>) {
  const defaultProps = {
    config: mockInitialConfig,
    onSaveSmtp: vi.fn(),
    onSaveStorage: vi.fn(),
    onSaveRazorpay: vi.fn(),
    onSaveTheme: vi.fn(),
    onTestStorage: vi.fn().mockResolvedValue({ success: true, message: 'Bucket connection successful!' }),
    onVerifyRazorpay: vi.fn().mockResolvedValue({ success: true, message: 'Razorpay keys valid!' }),
    onSendTestEmail: vi.fn().mockResolvedValue({
      success: true,
      message: 'Test email delivered successfully',
      timestamp: new Date().toISOString(),
    }),
    ...overrides,
  };

  return {
    ...render(<TenantConfigurationTabs {...defaultProps} />),
    props: defaultProps,
  };
}

describe('TenantConfigurationTabs & Administration Settings', () => {
  it('renders all 5 configuration tabs with status badges', () => {
    renderTabs();

    expect(screen.getByRole('button', { name: /SMTP Mail Server/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /File Storage/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Razorpay Gateway/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Theme & Branding/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Email Templates/i })).toBeInTheDocument();
  });

  it('renders SMTP configuration card by default and submits updated credentials', async () => {
    const { props } = renderTabs();

    expect(screen.getByText('SMTP Outgoing Mail Server')).toBeInTheDocument();
    expect(screen.getByDisplayValue('smtp.testmail.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('no-reply@testschool.edu')).toBeInTheDocument();

    const hostInput = screen.getByDisplayValue('smtp.testmail.com');
    fireEvent.change(hostInput, { target: { value: 'smtp.sendgrid.net' } });

    const submitBtn = screen.getByRole('button', { name: /Save SMTP Settings/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(props.onSaveSmtp).toHaveBeenCalledWith(
        expect.objectContaining({
          host: 'smtp.sendgrid.net',
          port: 587,
        })
      );
    });
  });

  it('navigates to File Storage tab and triggers connection test', async () => {
    const { props } = renderTabs();

    const storageTab = screen.getByRole('button', { name: /File Storage/i });
    fireEvent.click(storageTab);

    expect(screen.getByText('File Storage & Document Server')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test-documents')).toBeInTheDocument();

    const testBtn = screen.getByRole('button', { name: /Test Connection/i });
    fireEvent.click(testBtn);

    await waitFor(() => {
      expect(props.onTestStorage).toHaveBeenCalledWith(
        expect.objectContaining({
          bucket: 'test-documents',
          provider: 'AWS_S3',
        })
      );
      expect(screen.getByText('Bucket connection successful!')).toBeInTheDocument();
    });
  });

  it('navigates to Razorpay Gateway tab and switches between sandbox and live modes', async () => {
    const { props } = renderTabs();

    const razorpayTab = screen.getByRole('button', { name: /Razorpay Gateway/i });
    fireEvent.click(razorpayTab);

    expect(screen.getByText('Razorpay Payment Gateway')).toBeInTheDocument();
    expect(screen.getByDisplayValue('rzp_test_mock123')).toBeInTheDocument();

    const liveBtn = screen.getByRole('button', { name: /Production Live/i });
    fireEvent.click(liveBtn);

    const saveBtn = screen.getByRole('button', { name: /Save Payment Settings/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(props.onSaveRazorpay).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'LIVE',
          keyId: 'rzp_test_mock123',
        })
      );
    });
  });

  it('navigates to Theme & Branding tab and displays preset palettes', async () => {
    const { props } = renderTabs();

    const themeTab = screen.getByRole('button', { name: /Theme & Branding/i });
    fireEvent.click(themeTab);

    expect(screen.getByText('Theme, Branding & Identity')).toBeInTheDocument();
    expect(screen.getByText('Classic Navy')).toBeInTheDocument();
    expect(screen.getByText('Forest Emerald')).toBeInTheDocument();
    expect(screen.getByText('Crimson Heritage')).toBeInTheDocument();
    expect(screen.getByText('Live Branding Visualizer')).toBeInTheDocument();

    // Click Crimson Heritage preset
    fireEvent.click(screen.getByText('Crimson Heritage'));

    const saveBtn = screen.getByRole('button', { name: /Save Theme & Branding/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(props.onSaveTheme).toHaveBeenCalledWith(
        expect.objectContaining({
          primaryColor: '#b91c1c',
          accentColor: '#eab308',
        })
      );
    });
  });

  it('navigates to Email Templates tab and allows switching templates and views', () => {
    renderTabs();

    const templatesTab = screen.getByRole('button', { name: /Email Templates/i });
    fireEvent.click(templatesTab);

    expect(screen.getByText('Transactional Email Templates Gallery')).toBeInTheDocument();
    expect(screen.getByText('User Invitation & Onboarding')).toBeInTheDocument();
    expect(screen.getByText('Organization Welcome')).toBeInTheDocument();
    expect(screen.getByText('Password Reset Notice')).toBeInTheDocument();
    expect(screen.getByText('Email Address Verification')).toBeInTheDocument();

    // Select Password Reset template
    fireEvent.click(screen.getByText('Password Reset Notice'));
    expect(screen.getByText(/Reset Your School ERP Password/i)).toBeInTheDocument();

    // Switch to plain text view
    const plainTextBtn = screen.getByRole('button', { name: /Plain Text/i });
    fireEvent.click(plainTextBtn);
    expect(screen.getByText(/Your Single-Use Verification Code/i)).toBeInTheDocument();
  });

  it('opens Send Test Email modal and submits a diagnostic delivery', async () => {
    const { props } = renderTabs();

    const sendTestBtn = screen.getByRole('button', { name: /Send Test Email/i });
    fireEvent.click(sendTestBtn);

    expect(screen.getByText('Send Diagnostic Test Email')).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText(/test@yourdomain.com/i);
    fireEvent.change(emailInput, { target: { value: 'principal@school.edu' } });

    const dispatchBtn = screen.getByRole('button', { name: /Dispatch Test Email/i });
    fireEvent.click(dispatchBtn);

    await waitFor(() => {
      expect(props.onSendTestEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          toEmail: 'principal@school.edu',
          templateType: 'USER_INVITATION',
        })
      );
      expect(screen.getByText('Test email delivered successfully')).toBeInTheDocument();
    });
  });
});

