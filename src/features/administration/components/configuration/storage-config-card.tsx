import React, { useState } from 'react';
import { HardDrive, CheckCircle2, AlertTriangle, RefreshCw, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Select } from '@/components/forms/select';
import type { TenantStorageConfig, StorageProvider } from '../../types/admin.types';

export interface StorageConfigCardProps {
  initialConfig: TenantStorageConfig;
  onSave: (config: TenantStorageConfig) => Promise<void>;
  onTestConnection: (config: TenantStorageConfig) => Promise<{ success: boolean; message: string }>;
  isLoading?: boolean;
}

export const StorageConfigCard: React.FC<StorageConfigCardProps> = ({
  initialConfig,
  onSave,
  onTestConnection,
  isLoading = false,
}) => {
  const [config, setConfig] = useState<TenantStorageConfig>(initialConfig);
  const [secretKey, setSecretKey] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await onTestConnection({
        ...config,
        ...(secretKey ? { secretAccessKey: secretKey, isSecretSet: true } : {}),
      });
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Storage connection failed. Please verify credentials and bucket permissions.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);
    const updated = {
      ...config,
      ...(secretKey ? { secretAccessKey: secretKey, isSecretSet: true } : {}),
      maxUploadSizeMb: Number(config.maxUploadSizeMb) || 25,
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
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">File Storage & Document Server</h2>
              {config.isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Configured & Active</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Pending Setup</span>
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Secure object storage for student certificates, identity KYC, fee receipts, and school assets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={isTesting || !config.bucket}
            icon={<RefreshCw className={`h-3.5 w-3.5 text-purple-600 ${isTesting ? 'animate-spin' : ''}`} />}
            className="text-xs h-9"
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>
      </div>

      {testResult && (
        <div
          className={`rounded-xl border p-3 text-xs flex items-center gap-2 animate-in fade-in-0 ${
            testResult.success
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800'
              : 'border-red-500/30 bg-red-500/10 text-red-800'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{testResult.message}</span>
        </div>
      )}

      {isSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in-0">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Storage configuration saved successfully!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <Select
              label="Storage Service Provider"
              value={config.provider}
              onChange={(e) => setConfig({ ...config, provider: e.target.value as StorageProvider })}
            >
              <option value="AWS_S3">Amazon Web Services (AWS S3)</option>
              <option value="CLOUDFLARE_R2">Cloudflare R2 Object Storage</option>
              <option value="MINIO">MinIO (Private / Self-Hosted)</option>
              <option value="GCS">Google Cloud Storage (GCS)</option>
              <option value="LOCAL">Local Encrypted Volume</option>
            </Select>
          </div>

          <div className="md:col-span-4">
            <Input
              label="Bucket / Container Name"
              placeholder="e.g. greenwood-school-documents"
              value={config.bucket}
              onChange={(e) => setConfig({ ...config, bucket: e.target.value })}
              required
            />
          </div>

          <div className="md:col-span-4">
            <Input
              label="Cloud Region"
              placeholder="e.g. ap-south-1, us-east-1, auto"
              value={config.region}
              onChange={(e) => setConfig({ ...config, region: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Custom Endpoint (for MinIO or Cloudflare R2) */}
        {(config.provider === 'MINIO' || config.provider === 'CLOUDFLARE_R2') && (
          <div className="grid grid-cols-1 gap-4 animate-in fade-in-0">
            <Input
              label="Custom S3 API Endpoint URL"
              placeholder={config.provider === 'CLOUDFLARE_R2' ? 'https://<ACCOUNT_ID>.r2.cloudflarestorage.com' : 'https://s3.schoolinternal.net:9000'}
              value={config.endpointUrl || ''}
              onChange={(e) => setConfig({ ...config, endpointUrl: e.target.value })}
              helperText="Required for private MinIO instances and Cloudflare R2 accounts"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Access Key ID / S3 Client ID"
            placeholder="e.g. AKIAIOSFODNN7EXAMPLE"
            value={config.accessKeyId || ''}
            onChange={(e) => setConfig({ ...config, accessKeyId: e.target.value })}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Secret Access Key
            </label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                placeholder={config.isSecretSet ? '•••••••••••••••• (Leave blank to keep existing)' : 'Enter S3 secret key...'}
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full h-9 px-3 pr-10 text-xs bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showSecret ? 'Hide secret key' : 'Show secret key'}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {config.isSecretSet && !secretKey && (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Lock className="h-3 w-3 text-emerald-600" />
                <span>Cloud storage secret is securely encrypted.</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
          <Input
            label="Public CDN / Custom Asset Domain"
            placeholder="e.g. https://cdn.greenwood.edu"
            value={config.cdnCustomDomain || ''}
            onChange={(e) => setConfig({ ...config, cdnCustomDomain: e.target.value })}
            helperText="Accelerates download of fee receipts and academic reports"
          />

          <Input
            label="Max File Upload Limit (MB)"
            type="number"
            placeholder="25"
            value={String(config.maxUploadSizeMb)}
            onChange={(e) => setConfig({ ...config, maxUploadSizeMb: Number(e.target.value) })}
            helperText="Maximum allowed file size per upload (Standard: 25 MB)"
          />
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.isActive}
              onChange={(e) => setConfig({ ...config, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
            />
            <span className="text-xs font-semibold text-foreground">
              Enable dedicated tenant cloud storage
            </span>
          </label>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isLoading}
            className="text-xs h-9 font-bold"
          >
            {isLoading ? 'Saving...' : 'Save Storage Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};
