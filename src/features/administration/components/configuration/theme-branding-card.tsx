import React, { useState } from 'react';
import { Palette, Check, Sparkles, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Select } from '@/components/forms/select';
import type { TenantThemeConfig } from '../../types/admin.types';

export interface ThemeBrandingCardProps {
  initialConfig: TenantThemeConfig;
  onSave: (config: TenantThemeConfig) => Promise<void>;
  isLoading?: boolean;
}

const PRESET_PALETTES = [
  { name: 'Royal Blue', primary: '#2563eb', accent: '#f59e0b', desc: 'Modern & Authoritative' },
  { name: 'Classic Navy', primary: '#1e3a8a', accent: '#f59e0b', desc: 'Traditional Excellence' },
  { name: 'Forest Emerald', primary: '#059669', accent: '#d97706', desc: 'Growth & Vitality' },
  { name: 'Crimson Heritage', primary: '#b91c1c', accent: '#eab308', desc: 'Prestigious & Bold' },
  { name: 'Deep Indigo', primary: '#4338ca', accent: '#06b6d4', desc: 'Academic & Tech-forward' },
  { name: 'Oxford Slate', primary: '#334155', accent: '#3b82f6', desc: 'Minimalist & Refined' },
];

export const ThemeBrandingCard: React.FC<ThemeBrandingCardProps> = ({
  initialConfig,
  onSave,
  isLoading = false,
}) => {
  const [config, setConfig] = useState<TenantThemeConfig>(initialConfig);
  const [isSuccess, setIsSuccess] = useState(false);

  const applyPreset = (preset: typeof PRESET_PALETTES[0]) => {
    setConfig({
      ...config,
      primaryColor: preset.primary,
      accentColor: preset.accent,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);
    await onSave(config);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Theme, Branding & Identity</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customize colors, institutional crest, email footer, and portal styling across your tenant workspace.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:block">
            Applied to portal headers, badges, and outgoing emails
          </span>
        </div>
      </div>

      {isSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in-0">
          <Check className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Institutional branding and theme configuration saved successfully!</span>
        </div>
      )}

      {/* Preset Palettes */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Curated Institutional Color Palettes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PRESET_PALETTES.map((preset) => {
            const isSelected =
              config.primaryColor.toLowerCase() === preset.primary.toLowerCase() &&
              config.accentColor.toLowerCase() === preset.accent.toLowerCase();

            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
                    : 'border-border bg-surface hover:bg-surface-muted/50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <div
                    className="w-4 h-4 rounded-full shadow-2xs shrink-0"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div
                    className="w-3 h-3 rounded-full shadow-2xs shrink-0"
                    style={{ backgroundColor: preset.accent }}
                  />
                </div>
                <div className="font-bold text-xs text-foreground truncate">{preset.name}</div>
                <div className="text-[10px] text-muted-foreground truncate mt-0.5">{preset.desc}</div>
                {isSelected && (
                  <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Primary Brand Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                className="h-9 w-12 rounded-lg border border-border cursor-pointer bg-surface p-1 shrink-0"
              />
              <input
                type="text"
                value={config.primaryColor}
                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                placeholder="#2563eb"
                className="w-full h-9 px-3 text-xs font-mono uppercase bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">Main buttons, sidebar active states, and email headers</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Secondary Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                className="h-9 w-12 rounded-lg border border-border cursor-pointer bg-surface p-1 shrink-0"
              />
              <input
                type="text"
                value={config.accentColor}
                onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                placeholder="#f59e0b"
                className="w-full h-9 px-3 text-xs font-mono uppercase bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">Notification highlights, badges, and attention alerts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
          <Input
            label="Institution Display Name"
            placeholder="e.g. Greenwood International Academy"
            value={config.institutionName}
            onChange={(e) => setConfig({ ...config, institutionName: e.target.value })}
            required
          />

          <Input
            label="Motto / Tagline"
            placeholder="e.g. Excellence in Holistic Education & Leadership"
            value={config.tagline || ''}
            onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="School Crest / Logo URL"
            placeholder="https://cdn.greenwood.edu/logo.png"
            value={config.logoUrl || ''}
            onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
            helperText="High-resolution PNG or SVG with transparent background"
          />

          <Input
            label="Favicon URL"
            placeholder="https://cdn.greenwood.edu/favicon.ico"
            value={config.faviconUrl || ''}
            onChange={(e) => setConfig({ ...config, faviconUrl: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
          <Input
            label="Email Signature & Institutional Address"
            placeholder="e.g. 123 Academic Way, Springfield • admissions@greenwood.edu"
            value={config.emailSignature || ''}
            onChange={(e) => setConfig({ ...config, emailSignature: e.target.value })}
            helperText="Appended to the bottom of all outgoing emails and system notifications"
          />

          <Select
            label="Default Portal Appearance"
            value={config.defaultTheme}
            onChange={(e) => setConfig({ ...config, defaultTheme: e.target.value as 'SYSTEM' | 'LIGHT' | 'DARK' })}
          >
            <option value="SYSTEM">System Synchronized (Follows user OS preference)</option>
            <option value="LIGHT">Light Theme Default</option>
            <option value="DARK">Dark Theme Default</option>
          </Select>
        </div>

        {/* Live Visualizer Preview Box */}
        <div className="rounded-xl border border-border p-4 bg-surface-muted/30 space-y-3">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-primary" />
            <span>Live Branding Visualizer</span>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0"
                style={{ backgroundColor: config.primaryColor }}
              >
                {config.institutionName.charAt(0) || 'S'}
              </div>
              <div>
                <div className="font-bold text-sm text-foreground">{config.institutionName || 'School Name'}</div>
                <div className="text-xs text-muted-foreground">{config.tagline || 'Institutional Tagline'}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-bold rounded-lg text-white shadow-2xs transition-transform active:scale-95"
                style={{ backgroundColor: config.primaryColor }}
              >
                Primary Button
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border text-foreground bg-surface hover:bg-surface-muted/50"
              >
                Outline Action
              </button>
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                style={{ backgroundColor: `${config.accentColor}20`, color: config.accentColor }}
              >
                Accent Tag
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isLoading}
            className="text-xs h-9 font-bold"
          >
            {isLoading ? 'Saving...' : 'Save Theme & Branding'}
          </Button>
        </div>
      </form>
    </div>
  );
};
