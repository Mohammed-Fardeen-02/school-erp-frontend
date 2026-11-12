import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TemplateArchetypeCarousel, type RoleArchetype } from './template-archetype-carousel';
import { RoleProfileCard } from './role-profile-card';
import { GranularCapabilitySelector } from './granular-capability-selector';
import { RoleLivePreviewSidebar } from './role-live-preview-sidebar';
import { useAdminCampuses } from '../../hooks/use-admin';
import type { SaveRoleWithCapabilitiesPayload } from '../../types/admin.types';

const roleSchema = z.object({
  roleCode: z
    .string()
    .min(3, 'Role code must be at least 3 characters')
    .max(32, 'Role code cannot exceed 32 characters')
    .regex(/^[A-Z0-9_]+$/, 'Must be uppercase alphanumeric with underscores')
    .transform((v) => v.toUpperCase()),
  roleName: z.string().min(3, 'Role name must be at least 3 characters'),
  description: z.string().optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;

export interface RoleBuilderStudioProps {
  initialData?: {
    id?: string;
    roleCode: string;
    roleName: string;
    description?: string;
    permissionCodes: string[];
    campusScope?: 'ALL' | 'SPECIFIC';
    specificCampusId?: string;
  };
  onSubmit: (payload: SaveRoleWithCapabilitiesPayload, id?: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const RoleBuilderStudio: React.FC<RoleBuilderStudioProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEdit = Boolean(initialData?.id);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    initialData?.permissionCodes || []
  );
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string | null>(null);
  const [campusScope, setCampusScope] = useState<'ALL' | 'SPECIFIC'>(
    initialData?.campusScope || 'ALL'
  );
  const [specificCampusId, setSpecificCampusId] = useState<string>(
    initialData?.specificCampusId || ''
  );

  const { data: campuses = [] } = useAdminCampuses();
  const specificCampusName = campuses.find((c) => c.id === specificCampusId)?.name;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      roleCode: initialData?.roleCode || '',
      roleName: initialData?.roleName || '',
      description: initialData?.description || '',
    },
  });

  const watchedRoleName = watch('roleName');
  const watchedRoleCode = watch('roleCode');
  const watchedDescription = watch('description');

  const handleSelectArchetype = (archetype: RoleArchetype) => {
    setSelectedArchetypeId(archetype.id);
    if (archetype.id === 'BLANK') {
      setSelectedPermissions([]);
      return;
    }

    if (!isEdit) {
      setValue('roleName', archetype.name);
      setValue('roleCode', archetype.codePrefix);
      setValue('description', archetype.description);
    }
    setSelectedPermissions(archetype.recommendedPermissions);
  };

  const handleSave = async (data: RoleFormData, isDraft = false) => {
    const payload: SaveRoleWithCapabilitiesPayload = {
      roleCode: data.roleCode,
      roleName: data.roleName,
      description: data.description,
      permissionCodes: selectedPermissions,
      isDraft,
    };
    await onSubmit(payload, initialData?.id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 8 Columns: Builder Studio Canvas */}
      <div className="lg:col-span-8 space-y-6">
        {/* 1. Quick-Starter Role Archetypes (only shown on create) */}
        {!isEdit && (
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs">
            <TemplateArchetypeCarousel
              selectedArchetypeId={selectedArchetypeId}
              onSelectArchetype={handleSelectArchetype}
            />
          </div>
        )}

        {/* 2. Role Profile & Identity Card */}
        <RoleProfileCard
          register={register}
          errors={errors}
          isEdit={isEdit}
          campusScope={campusScope}
          onCampusScopeChange={setCampusScope}
          specificCampusId={specificCampusId}
          onSpecificCampusChange={setSpecificCampusId}
        />

        {/* 3. Granular Capability Matrix Builder */}
        <GranularCapabilitySelector
          selectedCodes={selectedPermissions}
          onChange={setSelectedPermissions}
        />
      </div>

      {/* Right 4 Columns: Sticky Live Role Privilege Preview Sidebar */}
      <div className="lg:col-span-4">
        <RoleLivePreviewSidebar
          roleName={watchedRoleName}
          roleCode={watchedRoleCode}
          description={watchedDescription}
          campusScope={campusScope}
          specificCampusName={specificCampusName}
          selectedPermissionCodes={selectedPermissions}
          isEdit={isEdit}
          isSubmitting={isSubmitting || isLoading}
          onSaveDraft={
            !isEdit ? handleSubmit((data) => handleSave(data, true)) : undefined
          }
          onPublish={handleSubmit((data) => handleSave(data, false))}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};
