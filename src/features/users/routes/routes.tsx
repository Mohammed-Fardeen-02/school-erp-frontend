import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PermissionGuard } from '@/app/guards/permission-guard';
import { UsersListPage, UserAllocationsPage } from '../pages';

export const UsersRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <PermissionGuard permission="settings.user_assignments.allocations.view">
            <UsersListPage />
          </PermissionGuard>
        }
      />
      <Route
        path=":id/allocations"
        element={
          <PermissionGuard permission="settings.user_assignments.allocations.view">
            <UserAllocationsPage />
          </PermissionGuard>
        }
      />
      <Route path="*" element={<Navigate to="/users" replace />} />
    </Routes>
  );
};

export default UsersRoutes;

