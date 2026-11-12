import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Save, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Select } from '@/components/forms/select';
import { EmbeddedPermissionPicker } from './embedded-permission-picker';
import type { SaveRoleWithCapabilitiesPayload } from '../../types/admin.types';

const roleSchema = z.object({
  roleCode: z
    .string()
    .min(3, 'Role code must be at least 3 characters')
    .regex(/^[A-Z0-9_]+$/, 'Must be uppercase alphanumeric with underscores')
    .transform((v) => v.toUpperCase()),
  roleName: z.string().min(3, 'Role name must be at least 3 characters'),
  description: z.string().optional(),
  baseTemplateCode: z.string().optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;

export interface RoleCapabilityFormProps {
  initialData?: {
    id?: string;
    roleCode: string;
    roleName: string;
    description?: string;
    permissionCodes: string[];
  };
  onSubmit: (payload: SaveRoleWithCapabilitiesPayload, id?: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const RoleCapabilityForm: React.FC<RoleCapabilityFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const isEdit = Boolean(initialData?.id);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    initialData?.permissionCodes || []
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      roleCode: initialData?.roleCode || '',
      roleName: initialData?.roleName || '',
      description: initialData?.description || '',
      baseTemplateCode: '',
    },
  });

  const handleBaseTemplateSelect = (templateCode: string) => {
    setValue('baseTemplateCode', templateCode);
    if (templateCode === 'TEACHER') {
      setSelectedPermissions([
        'academics.classes.view',
        'attendance.registers.view',
        'attendance.mark.edit',
        'exams.marks.entry',
      ]);
    } else if (templateCode === 'BURSAR') {
      setSelectedPermissions([
        'fees.invoices.view',
        'fees.payments.collect',
        'fees.discounts.apply',
        'fees.structures.manage',
      ]);
    } else if (templateCode === 'SCHOOL_ADMIN') {
      setSelectedPermissions([
        'academics.classes.view',
        'academics.classes.create',
        'academics.classes.edit',
        'students.directory.view',
        'students.admissions.create',
        'attendance.registers.view',
        'fees.invoices.view',
        'staff.directory.view',
        'settings.roles_permissions.rbac.view',
      ]);
    }
  };

  const onFormSubmit = async (data: RoleFormData, isDraft = false) => {
    const payload: SaveRoleWithCapabilitiesPayload = {
      roleCode: data.roleCode,
      roleName: data.roleName,
      description: data.description,
      baseTemplateCode: data.baseTemplateCode || undefined,
      permissionCodes: selectedPermissions,
      isDraft,
    };
    await onSubmit(payload, initialData?.id);
  };

  return (
    <div className="space-y-6">
      {/* Card 1: Role Identity Profile */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-border pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Role Profile & Metadata</h2>
            <p className="text-xs text-muted-foreground">
              Define the role identity, unique institutional code, and description.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Role Code (Uppercase Identifier)"
            placeholder="e.g. EXAM_COORDINATOR"
            disabled={isEdit}
            error={errors.roleCode?.message}
            {...register('roleCode')}
          />
          <Input
            label="Role Name"
            placeholder="e.g. Examination Coordinator"
            error={errors.roleName?.message}
            {...register('roleName')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Description"
            placeholder="Coordinates mid-term exams, hall schedules, and grade uploads."
            error={errors.description?.message}
            {...register('description')}
          />
          {!isEdit && (
            <Select
              label="Clone From Base Template (Optional)"
              onChange={(e) => handleBaseTemplateSelect(e.target.value)}
            >
              <option value="">Start with blank permissions</option>
              <option value="TEACHER">Teacher Template (Classroom & grading)</option>
              <option value="BURSAR">Bursar Template (Finance & fees)</option>
              <option value="SCHOOL_ADMIN">School Admin Template (Full operations)</option>
            </Select>
          )}
        </div>
      </div>

      {/* Card 2: Capability Picker */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Granted Capabilities & Access Checkboxes</h2>
          <p className="text-xs text-muted-foreground">
            Check the specific actions and domains this role is authorized to perform within the tenant.
          </p>
        </div>

        <EmbeddedPermissionPicker
          selectedCodes={selectedPermissions}
          onChange={setSelectedPermissions}
        />
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-border bg-surface/95 p-4 backdrop-blur-md shadow-xl">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Cancel & Return
        </Button>

        <div className="flex items-center gap-2">
          {!isEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSubmit((data) => onFormSubmit(data, true))}
              disabled={isSubmitting || isLoading}
              icon={<FileText className="h-4 w-4" />}
            >
              Save as Draft
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit((data) => onFormSubmit(data, false))}
            disabled={isSubmitting || isLoading}
            icon={<Save className="h-4 w-4" />}
          >
            {isEdit ? 'Save Role Changes' : 'Save & Publish Role'}
          </Button>
        </div>
      </div>
    </div>
  );
};

