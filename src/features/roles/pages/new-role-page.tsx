import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldPlus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { TextArea } from '@/components/forms/textarea';
import { useCreateRole } from '@/features/roles-permissions/hooks/use-roles';
import type { CreateRolePayload } from '@/features/roles-permissions/types/roles.types';

export const NewRolePage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateRole();

  const [roleCode, setRoleCode] = useState('');
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const cleanCode = roleCode.trim().toUpperCase();
    const cleanName = roleName.trim();

    if (!cleanCode || cleanCode.length < 2) {
      errs.roleCode = 'Role code must be at least 2 characters';
    } else if (cleanCode.length > 50) {
      errs.roleCode = 'Role code cannot exceed 50 characters';
    } else if (!/^[A-Z0-9_]+$/.test(cleanCode)) {
      errs.roleCode = 'Role code must contain only uppercase letters, numbers, and underscores';
    }

    if (!cleanName || cleanName.length < 2) {
      errs.roleName = 'Role name must be at least 2 characters';
    } else if (cleanName.length > 100) {
      errs.roleName = 'Role name cannot exceed 100 characters';
    }

    if (description && description.length > 500) {
      errs.description = 'Description cannot exceed 500 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload: CreateRolePayload = {
        roleCode: roleCode.trim().toUpperCase(),
        roleName: roleName.trim(),
        description: description.trim() || undefined,
      };

      const role = await createMutation.mutateAsync(payload);
      navigate(`/roles/${role.id}/matrix`);
    } catch {
      // Handled by createMutation.error
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/roles')}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-black text-foreground">Create Custom Role</h1>
          <p className="text-xs text-muted-foreground">
            Define a custom institutional role code and title, then configure its capability matrix.
          </p>
        </div>
      </div>

      {createMutation.isError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
          <strong>Creation Failed:</strong> {createMutation.error?.message || 'Server error occurred'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <ShieldPlus className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Role Specifications</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Role Code *
            </label>
            <Input
              value={roleCode}
              onChange={(e) => setRoleCode(e.target.value.toUpperCase())}
              placeholder="e.g. HOD_MATHEMATICS"
              error={errors.roleCode}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Unique uppercase identifier used in authorization assertions.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Role Name / Title *
            </label>
            <Input
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Head of Mathematics Department"
              error={errors.roleName}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Description (Optional)
            </label>
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the functional responsibilities and scope of this role..."
              rows={4}
              error={errors.description}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/roles')}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={createMutation.isPending}
            icon={<CheckCircle2 className="h-4 w-4" />}
          >
            Save & Configure Capabilities
          </Button>
        </div>
      </form>
    </div>
  );
};

