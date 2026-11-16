import React, { useMemo } from 'react';
import {
  Shield,
  Save,
  FileText,
  AlertTriangle,
  Building2,
  MapPin,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CANONICAL_DOMAINS } from './granular-capability-selector';

export interface RoleLivePreviewSidebarProps {
  roleName: string;
  roleCode: string;
  description?: string;
  campusScope: 'ALL' | 'SPECIFIC';
  specificCampusName?: string;
  selectedPermissionCodes: string[];
  isEdit?: boolean;
  isSubmitting?: boolean;
  onSaveDraft?: () => void;
  onPublish: () => void;
  onCancel: () => void;
}

export const RoleLivePreviewSidebar: React.FC<RoleLivePreviewSidebarProps> = ({
  roleName,
  roleCode,
  description,
  campusScope,
  specificCampusName,
  selectedPermissionCodes,
  isEdit = false,
  isSubmitting = false,
  onSaveDraft,
  onPublish,
  onCancel,
}) => {
  const selectedSet = useMemo(
    () => new Set(selectedPermissionCodes),
    [selectedPermissionCodes]
  );

  // Total possible capabilities across all canonical domains
  const totalCapabilities = useMemo(() => {
    return CANONICAL_DOMAINS.reduce((acc, m) => acc + m.actions.length, 0);
  }, []);

  // High risk permissions currently selected
  const highRiskSelected = useMemo(() => {
    const list: { code: string; label: string; module: string }[] = [];
    CANONICAL_DOMAINS.forEach((m) => {
      m.actions.forEach((a) => {
        if (a.isHighRisk && selectedSet.has(a.code)) {
          list.push({ code: a.code, label: a.label, module: m.name });
        }
      });
    });
    return list;
  }, [selectedSet]);

  // Module breakdown
  const moduleBreakdown = useMemo(() => {
    return CANONICAL_DOMAINS.map((m) => {
      const granted = m.actions.filter((a) => selectedSet.has(a.code)).length;
      return {
        id: m.id,
        name: m.name,
        granted,
        total: m.actions.length,
      };
    }).filter((m) => m.granted > 0);
  }, [selectedSet]);

  // Privilege Tier
  const tierInfo = useMemo(() => {
    const count = selectedPermissionCodes.length;
    if (count === 0) {
      return {
        tier: 'Unallocated',
        color: 'text-muted-foreground',
        bar: 'bg-muted',
        pct: 5,
        desc: 'Role has zero assigned capability privileges.',
      };
    }
    if (count <= 5) {
      return {
        tier: 'Viewer / Auditor',
        color: 'text-blue-600',
        bar: 'bg-blue-500',
        pct: 25,
        desc: 'Read-only access across assigned classroom rosters.',
      };
    }
    if (count <= 15) {
      return {
        tier: 'Operational Staff',
        color: 'text-emerald-600',
        bar: 'bg-emerald-500',
        pct: 50,
        desc: 'Daily operational actions, grading, and registers.',
      };
    }
    if (count <= 25) {
      return {
        tier: 'Department Manager',
        color: 'text-primary',
        bar: 'bg-primary',
        pct: 75,
        desc: 'Course syllabi, allocations, and financial receipts.',
      };
    }
    return {
      tier: 'Institutional Administrator',
      color: 'text-purple-700',
      bar: 'bg-purple-600',
      pct: 100,
      desc: 'Broad privileged access across the entire school tenant.',
    };
  }, [selectedPermissionCodes.length]);

  return (
    <div className="h-full">
      {/* Role Live Summary Card */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full space-y-4">
        <div className="space-y-4">
          {/* Header Badge */}
          <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                <Shield className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-foreground truncate">
                  {roleName || 'Unnamed Role'}
                </div>
                <div className="font-mono text-xs text-muted-foreground truncate">
                  {roleCode || 'CUSTOM_ROLE_CODE'}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
              {isEdit ? 'Editing Role' : 'New Custom Role'}
            </span>
          </div>

          {/* Scope Pill */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground font-medium">Scope:</span>
            {campusScope === 'ALL' ? (
              <span className="inline-flex items-center gap-1 font-bold text-xs text-primary bg-primary/5 border border-primary/20 px-2 py-0.5 rounded-md">
                <Building2 className="h-3 w-3" />
                <span>All Institutional Campuses</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-bold text-xs text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                <MapPin className="h-3 w-3" />
                <span>{specificCampusName || 'Designated Campus'}</span>
              </span>
            )}
          </div>

          {description && (
            <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2 leading-relaxed">
              "{description}"
            </p>
          )}

          {/* Privilege Tier Meter */}
          <div className="rounded-xl border border-border p-3.5 bg-surface-muted/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-semibold">Access Level</span>
              <span className={`font-bold ${tierInfo.color}`}>{tierInfo.tier}</span>
            </div>

            <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${tierInfo.bar}`}
                style={{ width: `${tierInfo.pct}%` }}
              />
            </div>

            <p className="text-[11px] text-muted-foreground">{tierInfo.desc}</p>
          </div>

          {/* Capability Counter */}
          <div className="space-y-2 pt-1 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Capabilities Granted</span>
              <span className="font-bold text-xs text-foreground">
                <strong className="text-primary">{selectedPermissionCodes.length}</strong> / {totalCapabilities}
              </span>
            </div>

            {/* Module Breakdown List */}
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 scrollbar-none">
              {moduleBreakdown.length > 0 ? (
                moduleBreakdown.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-surface-muted/50"
                  >
                    <span className="text-foreground truncate pr-2 font-medium">{m.name}</span>
                    <span className="font-mono text-muted-foreground shrink-0 font-semibold">
                      {m.granted} / {m.total}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground py-2 text-center">
                  No capabilities selected yet.
                </p>
              )}
            </div>
          </div>

          {/* High Risk Security Alert Warning Box */}
          {highRiskSelected.length > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 space-y-1.5 animate-in fade-in-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>{highRiskSelected.length} Sensitive Capabilities</span>
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                This role grants sensitive operations (e.g. publishing final grades or modifying fee structures).
              </p>
              <ul className="text-[10px] space-y-0.5 text-amber-900 dark:text-amber-200 font-mono list-disc list-inside">
                {highRiskSelected.slice(0, 3).map((h) => (
                  <li key={h.code} className="truncate">
                    {h.label}
                  </li>
                ))}
                {highRiskSelected.length > 3 && (
                  <li className="font-sans font-semibold">
                    +{highRiskSelected.length - 3} more sensitive privileges
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2 border-t border-border">
          <Button
            variant="primary"
            className="w-full justify-center text-xs h-9 font-bold"
            onClick={onPublish}
            disabled={isSubmitting || selectedPermissionCodes.length === 0}
            icon={<Save className="h-4 w-4" />}
          >
            {isEdit ? 'Save Role Changes' : 'Save & Publish Role'}
          </Button>

          {!isEdit && onSaveDraft && (
            <Button
              variant="outline"
              className="w-full justify-center text-xs h-9 font-medium"
              onClick={onSaveDraft}
              disabled={isSubmitting}
              icon={<FileText className="h-4 w-4" />}
            >
              Save as Inactive Draft
            </Button>
          )}

          <Button
            variant="ghost"
            className="w-full justify-center text-xs h-8 text-muted-foreground hover:text-foreground"
            onClick={onCancel}
            icon={<ArrowLeft className="h-3.5 w-3.5" />}
          >
            Cancel & Return
          </Button>
        </div>
      </div>
    </div>
  );
};
