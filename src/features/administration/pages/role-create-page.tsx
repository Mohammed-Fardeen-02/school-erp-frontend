import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldPlus } from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { RoleCapabilityForm } from '../components/roles/role-capability-form';
import { useSaveRoleWithCapabilities } from '../hooks/use-admin';
import type { SaveRoleWithCapabilitiesPayload } from '../types/admin.types';

export const RoleCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const saveRoleMutation = useSaveRoleWithCapabilities();

  const handleSubmit = async (payload: SaveRoleWithCapabilitiesPayload) => {
    await saveRoleMutation.mutateAsync({ payload });
    navigate('/admin/roles');
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

      <RoleCapabilityForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/roles')}
        isLoading={saveRoleMutation.isPending}
      />
    </PageWrapper>
  );
};

