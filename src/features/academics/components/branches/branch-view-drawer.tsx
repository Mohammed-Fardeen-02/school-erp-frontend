import React from 'react';
import {
  X,
  GitBranch,
  Building2,
  Mail,
  Phone,
  User,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Star,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/data-display/badge';
import type { BranchDto } from '../types/branches.types';

export interface BranchViewDrawerProps {
  branch: BranchDto | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (branch: BranchDto) => void;
}

export const BranchViewDrawer: React.FC<BranchViewDrawerProps> = ({
  branch,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !branch) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md bg-surface border-l border-border shadow-2xl flex flex-col h-full overflow-hidden z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Branch Details</h3>
              <p className="text-xs text-muted-foreground font-mono">{branch.code}</p>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Identity Card */}
          <div className="rounded-2xl border border-border bg-surface-muted/20 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">{branch.name}</h2>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge variant={branch.isActive ? 'success' : 'neutral'}>
                    {branch.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {branch.isMainCampus && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <Star className="h-3 w-3 fill-current" />
                      Main Campus
                    </span>
                  )}
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    {branch.locationType.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Attributes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Administrative & Contact Details
            </h4>
            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface p-3">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-[11px]">Academic Head / Principal</span>
                  <span className="font-semibold text-foreground truncate block">
                    {branch.principalName || 'Not Assigned'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface p-3">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-[11px]">Official Email</span>
                  <span className="font-semibold text-foreground truncate block font-mono">
                    {branch.email || '—'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface p-3">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-[11px]">Contact Phone</span>
                  <span className="font-semibold text-foreground truncate block">
                    {branch.phone || '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Campus Location & Address
            </h4>
            <div className="rounded-xl border border-border bg-surface p-3.5 space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="text-foreground">
                  <div>{branch.addressLine1 || 'No street address provided'}</div>
                  {branch.addressLine2 && <div>{branch.addressLine2}</div>}
                  <div className="text-muted-foreground mt-1">
                    {[branch.city, branch.state, branch.postalCode, branch.country]
                      .filter(Boolean)
                      .join(', ') || 'No regional details'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meta Dates */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Created: {new Date(branch.createdAt).toLocaleDateString()}
            </span>
            <span>ID: {branch.id.slice(0, 8)}...</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 bg-surface-muted/30 flex items-center justify-end gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(branch);
              }}
              icon={<Edit className="h-3.5 w-3.5" />}
            >
              Edit Branch
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
