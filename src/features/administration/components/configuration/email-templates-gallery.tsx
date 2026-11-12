import React, { useState, useMemo } from 'react';
import { Mail, Monitor, Smartphone, Send, Code, Sparkles, Shield, UserCheck, Building2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CANONICAL_EMAIL_TEMPLATES, renderEmailTemplate } from './email-templates/template-definitions';
import type { EmailTemplateType, TenantThemeConfig } from '../../types/admin.types';

export interface EmailTemplatesGalleryProps {
  themeConfig?: TenantThemeConfig;
  onOpenTestModal: (templateType: EmailTemplateType) => void;
}

export const EmailTemplatesGallery: React.FC<EmailTemplatesGalleryProps> = ({
  themeConfig,
  onOpenTestModal,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType>('USER_INVITATION');
  const [viewMode, setViewMode] = useState<'DESKTOP' | 'MOBILE' | 'SOURCE'>('DESKTOP');

  const activeTemplate = CANONICAL_EMAIL_TEMPLATES[selectedTemplate];

  const rendered = useMemo(() => {
    return renderEmailTemplate(selectedTemplate, {
      organizationName: themeConfig?.institutionName || 'Greenwood International Academy',
      primaryColor: themeConfig?.primaryColor || '#2563eb',
      supportEmail: 'admin@greenwood.edu',
    });
  }, [selectedTemplate, themeConfig]);

  const templateList: { id: EmailTemplateType; name: string; icon: React.ElementType; category: string }[] = [
    { id: 'USER_INVITATION', name: 'User Invitation & Onboarding', icon: UserCheck, category: 'Onboarding' },
    { id: 'ORG_WELCOME', name: 'Organization Welcome', icon: Building2, category: 'Onboarding' },
    { id: 'PASSWORD_RESET', name: 'Password Reset Notice', icon: KeyRound, category: 'Security' },
    { id: 'EMAIL_VERIFICATION', name: 'Email Address Verification', icon: Shield, category: 'Account' },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Transactional Email Templates Gallery</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Preview and verify responsive transactional emails branded with your school's color scheme.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-surface-muted/60 border border-border rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewMode('DESKTOP')}
              title="Desktop View"
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'DESKTOP'
                  ? 'bg-surface text-primary shadow-2xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('MOBILE')}
              title="Mobile View"
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'MOBILE'
                  ? 'bg-surface text-primary shadow-2xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('SOURCE')}
              title="Plaintext Source"
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'SOURCE'
                  ? 'bg-surface text-primary shadow-2xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Plain Text</span>
            </button>
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onOpenTestModal(selectedTemplate)}
            icon={<Send className="h-3.5 w-3.5" />}
            className="text-xs h-9 font-bold"
          >
            Send Sample
          </Button>
        </div>
      </div>

      {/* Main Grid: Template Selector (Left) + Live Preview Frame (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Template List Cards */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-xs font-bold text-foreground block mb-1">Select Email Template:</span>

          {templateList.map((tpl) => {
            const isSelected = selectedTemplate === tpl.id;
            const Icon = tpl.icon;

            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
                    : 'border-border bg-surface hover:bg-surface-muted/50'
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isSelected ? 'bg-primary text-white' : 'bg-surface-muted text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-foreground truncate">{tpl.name}</span>
                    <span className="text-[10px] font-semibold text-muted-foreground bg-surface-muted px-1.5 py-0.2 rounded">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {CANONICAL_EMAIL_TEMPLATES[tpl.id].description}
                  </p>
                </div>
              </button>
            );
          })}

          {/* Dynamic Tokens Guide */}
          <div className="rounded-xl border border-border p-3.5 bg-surface-muted/40 space-y-2 mt-4">
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Active Template Tokens</span>
            </div>
            <div className="space-y-1 text-[11px] text-muted-foreground">
              {Object.keys(activeTemplate.sampleVariables).slice(0, 5).map((v) => (
                <div key={v} className="flex items-center justify-between font-mono">
                  <span className="text-primary font-semibold">{`{{${v}}}`}</span>
                  <span className="text-foreground/80 truncate max-w-[140px]">
                    {activeTemplate.sampleVariables[v]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Display Box */}
        <div className="lg:col-span-8 space-y-3">
          {/* Subject Bar */}
          <div className="rounded-xl border border-border bg-surface-muted/40 px-4 py-2.5 flex items-center gap-2 text-xs">
            <span className="font-bold text-muted-foreground shrink-0">Subject:</span>
            <span className="font-medium text-foreground truncate">{rendered.subject}</span>
          </div>

          {/* Frame Container */}
          <div className="rounded-2xl border border-border bg-slate-900/5 p-4 flex justify-center items-center min-h-[520px] overflow-x-auto">
            {viewMode === 'SOURCE' ? (
              <div className="w-full h-full max-h-[500px] overflow-y-auto bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed">
                {rendered.text}
              </div>
            ) : (
              <div
                className={`transition-all duration-300 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden ${
                  viewMode === 'MOBILE' ? 'w-[375px]' : 'w-full max-w-[620px]'
                }`}
              >
                <iframe
                  title="Email Template Live Preview"
                  srcDoc={rendered.html}
                  className="w-full h-[540px] border-none"
                  sandbox="allow-same-origin"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
