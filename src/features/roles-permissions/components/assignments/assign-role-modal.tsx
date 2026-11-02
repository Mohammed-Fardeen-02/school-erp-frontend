import * as React from 'react';
import { useState, useMemo } from 'react';
import {
  X,
  UserCheck,
  Shield,
  Building2,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/feedback/alert';
import { MemberSearchSelector } from './member-search-selector';
import { useRolesList } from '../../hooks/use-roles';
import { useOrganizationCampuses, useAssignRole } from '../../hooks/use-assignments';
import { usePermission } from '../../hooks/use-permission';
import type {
  WorkspaceMemberSummary,
  AssignmentRecord,
} from '../../types/assignments.types';
import type { RoleSummary } from '../../types/roles.types';

export interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (assignment: AssignmentRecord) => void;
  initialMember?: WorkspaceMemberSummary | null;
  initialRoleId?: string | null;
}

export const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMember = null,
  initialRoleId = null,
}) => {
  // Authorization check
  const { hasPermission: canAssign, isLoading: checkingPermission } = usePermission(
    'settings.user_assignments.allocations.assign'
  );

  // Form State
  const [selectedMember, setSelectedMember] = useState<WorkspaceMemberSummary | null>(
    initialMember
  );
  const [selectedRoleId, setSelectedRoleId] = useState<string>(initialRoleId || '');
  const [scopeType, setScopeType] = useState<'ORGANIZATION' | 'CAMPUS'>('ORGANIZATION');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sync initial props only when modal transitions to open
  const prevOpenRef = React.useRef(isOpen);
  React.useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setSelectedMember(initialMember);
      setSelectedRoleId(initialRoleId || '');
      setScopeType('ORGANIZATION');
      setSelectedLocationId('');
      setValidationErrors({});
      setSubmitError(null);
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, initialMember, initialRoleId]);

  // Load active roles
  const {
    data: rolesData,
    isLoading: loadingRoles,
  } = useRolesList({
    isActive: true,
    limit: 100,
  });

  const activeRoles: RoleSummary[] = useMemo(() => {
    return (rolesData?.roles || []).filter((r) => r.isActive);
  }, [rolesData]);

  // Load campuses for campus-scoped assignment
  const {
    data: campuses = [],
    isLoading: loadingCampuses,
  } = useOrganizationCampuses({ enabled: isOpen });

  // Mutation
  const assignMutation = useAssignRole();

  if (!isOpen) return null;

  const selectedRole = activeRoles.find((r) => r.id === selectedRoleId);
  const selectedCampus = campuses.find((c) => c.id === selectedLocationId);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!selectedMember) {
      errors.member = 'Please search and select an active organization member.';
    }

    if (!selectedRoleId) {
      errors.role = 'Please select a role to assign.';
    }

    if (scopeType === 'CAMPUS' && !selectedLocationId) {
      errors.location = 'Please select a specific campus for campus-scoped assignment.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;
    if (!selectedMember || !selectedRoleId) return;

    try {
      const assignment = await assignMutation.mutateAsync({
        userId: selectedMember.id,
        roleId: selectedRoleId,
        locationId: scopeType === 'CAMPUS' ? selectedLocationId : null,
      });

      onSuccess?.(assignment);
      onClose();
    } catch (err: unknown) {
      let message = 'Failed to assign role. Please try again.';
      if (err instanceof Error) {
        message = err.message;
      }
      setSubmitError(message);
    }
  };

  return (
    <div
      data-testid="assign-role-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Assign Role to Member</h3>
              <p className="text-xs text-muted-foreground">
                Grant capability profiles to active organization members
              </p>
            </div>
          </div>
          <button
            type="button"
            data-testid="close-assign-role-modal"
            disabled={assignMutation.isPending}
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Permission Guard Alert */}
          {!checkingPermission && !canAssign && (
            <Alert variant="error" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                You do not have permission (<code>settings.user_assignments.allocations.assign</code>) to
                allocate roles.
              </span>
            </Alert>
          )}

          {/* Submission Error Banner */}
          {(submitError || assignMutation.error?.message) && (
            <Alert
              variant="error"
              data-testid="assign-role-error"
              className="flex items-start justify-between gap-2 text-xs"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Assignment Failed</span>
                  <span>{submitError || assignMutation.error?.message}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSubmitError(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Alert>
          )}

          {/* Section 1: Member Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Select Member <span className="text-danger">*</span>
            </label>
            <MemberSearchSelector
              selectedMember={selectedMember}
              onSelectMember={(m) => {
                setSelectedMember(m);
                if (validationErrors.member) {
                  setValidationErrors((prev) => {
                    const next = { ...prev };
                    delete next.member;
                    return next;
                  });
                }
              }}
              disabled={assignMutation.isPending || !canAssign}
            />
            {validationErrors.member && (
              <p
                data-testid="error-member-required"
                className="text-xs text-danger font-medium mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {validationErrors.member}
              </p>
            )}
          </div>

          {/* Section 2: Role Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="role-select" className="block text-xs font-semibold text-foreground">
                Select Role <span className="text-danger">*</span>
              </label>
              {loadingRoles && (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin text-primary" /> Loading roles...
                </span>
              )}
            </div>

            <div className="relative">
              <select
                id="role-select"
                data-testid="role-select"
                value={selectedRoleId}
                disabled={assignMutation.isPending || loadingRoles || !canAssign}
                onChange={(e) => {
                  setSelectedRoleId(e.target.value);
                  if (validationErrors.role) {
                    setValidationErrors((prev) => {
                      const next = { ...prev };
                      delete next.role;
                      return next;
                    });
                  }
                }}
                className={cn(
                  'w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-sm text-foreground shadow-xs transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                  (assignMutation.isPending || loadingRoles || !canAssign) &&
                    'opacity-60 cursor-not-allowed bg-surface-muted',
                  validationErrors.role && 'border-danger focus:ring-danger/20'
                )}
              >
                <option value="">-- Choose an active role --</option>
                {activeRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.roleName} ({role.roleCode}) —{' '}
                    {role.roleType === 'SYSTEM_TEMPLATE' ? 'System Template' : 'Custom Role'}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Role Meta Badge */}
            {selectedRole && (
              <div
                data-testid="selected-role-preview"
                className="mt-2 p-2.5 rounded-lg border border-border/70 bg-surface-muted/40 text-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">{selectedRole.roleName}</span>
                    <span className="font-mono text-[11px] text-muted-foreground ml-1.5">
                      {selectedRole.roleCode}
                    </span>
                  </div>
                </div>
                {selectedRole.roleType === 'SYSTEM_TEMPLATE' ? (
                  <span
                    data-testid="badge-system-template"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200"
                  >
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    System Template
                  </span>
                ) : (
                  <span
                    data-testid="badge-custom-role"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200"
                  >
                    Custom Role
                  </span>
                )}
              </div>
            )}

            {validationErrors.role && (
              <p
                data-testid="error-role-required"
                className="text-xs text-danger font-medium mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {validationErrors.role}
              </p>
            )}
          </div>

          {/* Section 3: Assignment Scope Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">
              Assignment Scope <span className="text-danger">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Organization-Wide Option */}
              <label
                data-testid="scope-option-org"
                className={cn(
                  'flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all',
                  scopeType === 'ORGANIZATION'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-surface hover:bg-surface-muted/40',
                  (assignMutation.isPending || !canAssign) && 'opacity-60 pointer-events-none'
                )}
              >
                <input
                  type="radio"
                  name="assignment-scope"
                  value="ORGANIZATION"
                  checked={scopeType === 'ORGANIZATION'}
                  onChange={() => {
                    setScopeType('ORGANIZATION');
                    setSelectedLocationId('');
                    if (validationErrors.location) {
                      setValidationErrors((prev) => {
                        const next = { ...prev };
                        delete next.location;
                        return next;
                      });
                    }
                  }}
                  className="mt-0.5 text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    Organization-Wide
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Valid across all campuses and facilities in this institution.
                  </p>
                </div>
              </label>

              {/* Campus-Scoped Option */}
              <label
                data-testid="scope-option-campus"
                className={cn(
                  'flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all',
                  scopeType === 'CAMPUS'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-surface hover:bg-surface-muted/40',
                  (assignMutation.isPending || !canAssign) && 'opacity-60 pointer-events-none'
                )}
              >
                <input
                  type="radio"
                  name="assignment-scope"
                  value="CAMPUS"
                  checked={scopeType === 'CAMPUS'}
                  onChange={() => setScopeType('CAMPUS')}
                  className="mt-0.5 text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    Campus-Scoped
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Restricts permissions strictly to a specific physical campus.
                  </p>
                </div>
              </label>
            </div>

            {/* Campus Selector (when Campus-Scoped is chosen) */}
            {scopeType === 'CAMPUS' && (
              <div
                data-testid="campus-select-container"
                className="pt-2 pl-1 space-y-1.5 animate-in fade-in duration-150"
              >
                <label
                  htmlFor="campus-select"
                  className="block text-xs font-semibold text-foreground"
                >
                  Target Campus <span className="text-danger">*</span>
                </label>
                <select
                  id="campus-select"
                  data-testid="campus-select"
                  value={selectedLocationId}
                  disabled={assignMutation.isPending || loadingCampuses || !canAssign}
                  onChange={(e) => {
                    setSelectedLocationId(e.target.value);
                    if (validationErrors.location) {
                      setValidationErrors((prev) => {
                        const next = { ...prev };
                        delete next.location;
                        return next;
                      });
                    }
                  }}
                  className={cn(
                    'w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-sm text-foreground shadow-xs transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                    validationErrors.location && 'border-danger focus:ring-danger/20'
                  )}
                >
                  <option value="">-- Choose active campus --</option>
                  {campuses.map((campus) => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name} ({campus.code}) {campus.isMainCampus ? '— Main Campus' : ''}
                    </option>
                  ))}
                </select>

                {validationErrors.location && (
                  <p
                    data-testid="error-location-required"
                    className="text-xs text-danger font-medium mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {validationErrors.location}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Section 4: Visual Assignment Summary Preview */}
          {selectedMember && selectedRole && (
            <div
              data-testid="assignment-summary-preview"
              className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800/60 text-xs space-y-1.5"
            >
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Assignment Summary Preview
              </div>
              <div className="text-foreground/90 space-y-1 pl-5">
                <p>
                  <strong>Member:</strong> {selectedMember.firstName} {selectedMember.lastName} (
                  {selectedMember.email})
                </p>
                <p>
                  <strong>Role:</strong> {selectedRole.roleName} ({selectedRole.roleCode})
                </p>
                <p>
                  <strong>Scope:</strong>{' '}
                  {scopeType === 'ORGANIZATION' ? (
                    <span className="font-semibold text-primary">Organization-Wide</span>
                  ) : selectedCampus ? (
                    <span className="font-semibold text-amber-700 dark:text-amber-300">
                      Campus: {selectedCampus.name} ({selectedCampus.code})
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">(Select campus above)</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-surface-muted/30">
          <Button
            type="button"
            variant="outline"
            data-testid="cancel-assign-role-button"
            disabled={assignMutation.isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            data-testid="submit-assign-role-button"
            disabled={assignMutation.isPending || (checkingPermission ? false : !canAssign)}
            onClick={handleSubmit}
            className="min-w-32"
          >
            {assignMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Assigning...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                Assign Role
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

