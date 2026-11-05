import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PermissionGuard } from '@/app/guards/permission-guard';
import { RolesListPage, NewRolePage, RoleMatrixPage } from '../pages';

export const RolesRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <PermissionGuard permission="settings.roles_permissions.rbac.view">
            <RolesListPage />
          </PermissionGuard>
        }
      />
      <Route
        path="new"
        element={
          <PermissionGuard permission="settings.roles_permissions.rbac.edit">
            <NewRolePage />
          </PermissionGuard>
        }
      />
      <Route
        path=":id/matrix"
        element={
          <PermissionGuard permission="settings.roles_permissions.rbac.view">
            <RoleMatrixPage />
          </PermissionGuard>
        }
      />
      <Route path="*" element={<Navigate to="/roles" replace />} />
    </Routes>
  );
};

export default RolesRoutes;

