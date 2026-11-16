import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldPlus } from 'lucide-react';
import { useToast } from '@/components/feedback/toast';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { RoleBuilderStudio } from '../components/roles/role-builder-studio';
import { useSaveRoleWithCapabilities } from '../hooks/use-admin';
import type { SaveRoleWithCapabilitiesPayload } from '../types/admin.types';

export const RoleCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const saveRoleMutation = useSaveRoleWithCapabilities();

  const handleSubmit = async (payload: SaveRoleWithCapabilitiesPayload) => {
    try {
      await saveRoleMutation.mutateAsync({ payload });
      toast.success(
        `Custom role "${payload.roleName}" created with granular permissions`,
        'Role Created'
      );
      navigate('/admin/roles');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create role';
      toast.error(msg, 'Role Creation Failed');
    }
  };

  return (
    <PageWrapper className="space-y-6">
      <AdminPageHeader
        title="Author Custom Role"
        subtitle="Define a custom institutional role and configure granted capability checkboxes by domain module."
        icon={ShieldPlus}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Administration', href: '/admin' },
          { label: 'Roles', href: '/admin/roles' },
          { label: 'New Custom Role' },
        ]}
      />

      <RoleBuilderStudio
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/roles')}
        isLoading={saveRoleMutation.isPending}
      />
    </PageWrapper>
  );
};

