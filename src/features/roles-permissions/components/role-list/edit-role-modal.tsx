import React, { useState, useEffect } from 'react';
import { X, Shield, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { TextArea } from '@/components/forms/textarea';
import { useToast } from '@/components/feedback/toast';
import { useUpdateRole } from '../../hooks/use-roles';
import type { RoleSummary } from '../../types/roles.types';

export interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleSummary | null;
  onSuccess?: () => void;
}

export const EditRoleModal: React.FC<EditRoleModalProps> = ({
  isOpen,
  onClose,
  role,
  onSuccess,
}) => {
  const toast = useToast();
  const updateMutation = useUpdateRole();

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ roleName?: string }>({});

  useEffect(() => {
    if (role && isOpen) {
      setRoleName(role.roleName || '');
      setDescription(role.description || '');
      setErrors({});
    }
  }, [role, isOpen]);

  if (!isOpen || !role) return null;

  const validate = (): boolean => {
    const errs: { roleName?: string } = {};
    if (!roleName.trim() || roleName.trim().length < 2) {
      errs.roleName = 'Role name must be at least 2 characters';
    } else if (roleName.trim().length > 100) {
      errs.roleName = 'Role name cannot exceed 100 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateMutation.mutateAsync({
        roleId: role.id,
        payload: {
          roleName: roleName.trim(),
          description: description.trim() || undefined,
        },
      });

      toast.success(`Role "${roleName.trim()}" updated successfully`, 'Role Updated');
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update role';
      toast.error(msg, 'Update Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Edit Custom Role</h3>
              <p className="text-xs text-muted-foreground font-mono">{role.roleCode}</p>
            </div>
          </div>
          <button
            type="button"
            disabled={updateMutation.isPending}
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Role Code (Immutable)
            </label>
            <Input
              value={role.roleCode}
              disabled
              className="bg-surface-muted/50 font-mono text-xs cursor-not-allowed"
            />
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              Unique programmatic identifier cannot be modified after creation.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Role Display Name <span className="text-danger">*</span>
            </label>
            <Input
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Senior Academic Coordinator"
              error={errors.roleName}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Description
            </label>
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe institutional operational responsibilities and scope..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={updateMutation.isPending}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={updateMutation.isPending}
              icon={<Save className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

