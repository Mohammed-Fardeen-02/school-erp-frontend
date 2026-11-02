import * as React from 'react';
import { useState, useEffect } from 'react';
import { X, Copy, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { TextArea } from '@/components/forms/textarea';
import type { RoleSummary, CloneTemplatePayload } from '../../types/roles.types';

export interface CloneRoleModalProps {
  isOpen: boolean;
  template: RoleSummary | null;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (templateId: string, payload: CloneTemplatePayload) => void;
}

export const CloneRoleModal: React.FC<CloneRoleModalProps> = ({
  isOpen,
  template,
  loading = false,
  error = null,
  onClose,
  onSubmit,
}) => {
  const [roleCode, setRoleCode] = useState('');
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (template) {
      const suggestedCode = template.roleCode.startsWith('CUSTOM_')
        ? template.roleCode
        : `CUSTOM_${template.roleCode}`;
      setRoleCode(suggestedCode);
      setRoleName(`${template.roleName} (Custom)`);
      setDescription(`Cloned from system template ${template.roleName}`);
      setValidationErrors({});
    }
  }, [template]);

  if (!isOpen || !template) return null;

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    const cleanCode = roleCode.trim().toUpperCase();
    const cleanName = roleName.trim();

    if (!cleanCode || cleanCode.length < 2) {
      errors.roleCode = 'Role code must be at least 2 characters';
    } else if (cleanCode.length > 50) {
      errors.roleCode = 'Role code cannot exceed 50 characters';
    } else if (!/^[A-Z0-9_]+$/.test(cleanCode)) {
      errors.roleCode = 'Role code must contain only uppercase letters, numbers, and underscores';
    }

    if (!cleanName || cleanName.length < 2) {
      errors.roleName = 'Role name must be at least 2 characters';
    } else if (cleanName.length > 100) {
      errors.roleName = 'Role name cannot exceed 100 characters';
    }

    if (description && description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(template.id, {
      roleCode: roleCode.trim().toUpperCase(),
      roleName: roleName.trim(),
      description: description.trim() ? description.trim() : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
              <Copy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Clone Role Template</h3>
              <p className="text-xs text-muted-foreground">
                Create a tenant-owned copy from an immutable platform template
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Source Template Info Banner */}
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-purple-200 bg-purple-50/50 p-3 text-xs text-purple-900 dark:border-purple-800/40 dark:bg-purple-950/20 dark:text-purple-300">
          <ShieldCheck className="h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />
          <div>
            <span className="font-semibold">Source Template: </span>
            <span>{template.roleName} </span>
            <code className="rounded bg-purple-100 px-1 py-0.5 font-mono text-[11px] text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {template.roleCode}
            </code>
            <p className="mt-0.5 text-[11px] text-purple-700/80 dark:text-purple-400">
              All baseline permissions will be cloned into the new custom role.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              New Custom Role Code <span className="text-danger">*</span>
            </label>
            <Input
              value={roleCode}
              onChange={(e) => {
                setRoleCode(e.target.value.toUpperCase().replace(/\s+/g, '_'));
                if (validationErrors.roleCode) {
                  setValidationErrors((prev) => ({ ...prev, roleCode: '' }));
                }
              }}
              placeholder="e.g. CUSTOM_BRANCH_ACCOUNTANT"
              disabled={loading}
              className="font-mono text-xs uppercase"
              aria-invalid={Boolean(validationErrors.roleCode)}
            />
            {validationErrors.roleCode ? (
              <p className="mt-1 text-[11px] text-danger">{validationErrors.roleCode}</p>
            ) : (
              <p className="mt-1 text-[11px] text-muted-foreground">
                Must be unique within your organization.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              New Custom Role Name <span className="text-danger">*</span>
            </label>
            <Input
              value={roleName}
              onChange={(e) => {
                setRoleName(e.target.value);
                if (validationErrors.roleName) {
                  setValidationErrors((prev) => ({ ...prev, roleName: '' }));
                }
              }}
              placeholder="e.g. Branch Accountant (Custom)"
              disabled={loading}
              aria-invalid={Boolean(validationErrors.roleName)}
            />
            {validationErrors.roleName && (
              <p className="mt-1 text-[11px] text-danger">{validationErrors.roleName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Description <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add customization notes..."
              rows={3}
              disabled={loading}
            />
            {validationErrors.description && (
              <p className="mt-1 text-[11px] text-danger">{validationErrors.description}</p>
            )}
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={loading}
              icon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
            >
              {loading ? 'Cloning Template...' : 'Clone as Custom Role'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
