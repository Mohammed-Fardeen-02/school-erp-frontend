import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PermissionGuard } from '@/app/guards/permission-guard';
import { TenantsListPage, NewTenantPage, TenantDetailPage } from '../pages';

export const TenantsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <PermissionGuard permission="organizations.manage">
            <TenantsListPage />
          </PermissionGuard>
        }
      />
      <Route
        path="new"
        element={
          <PermissionGuard permission="organizations.manage">
            <NewTenantPage />
          </PermissionGuard>
        }
      />
      <Route
        path=":id"
        element={
          <PermissionGuard permission="organizations.manage">
            <TenantDetailPage />
          </PermissionGuard>
        }
      />
      <Route path="*" element={<Navigate to="/tenants" replace />} />
    </Routes>
  );
};

export default TenantsRoutes;

