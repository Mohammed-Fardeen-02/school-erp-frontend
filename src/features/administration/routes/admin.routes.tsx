import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PermissionGuard } from '@/app/guards/permission-guard';
import {
  AdminOverviewPage,
  OrganizationsPage,
  UsersPage,
  RolesPage,
  RoleCreatePage,
  SecurityPage,
  BillingPage,
  PlansPage,
  AuditLogsPage,
  TenantConfigurationPage,
} from '../pages';
import { RoleMatrixPage } from '@/features/roles/pages/role-matrix-page';
import { NewTenantPage, TenantDetailPage } from '@/features/tenants/pages';
import { BranchesPage } from '@/features/academics/pages/branches-page';

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Hub Desk Overview */}
      <Route
        index
        element={
          <PermissionGuard permission="settings.roles_permissions.rbac.view">
            <AdminOverviewPage />
          </PermissionGuard>
        }
      />

      {/* 2. Organization Management */}
      <Route
        path="organizations"
        element={
          <PermissionGuard permission="organizations.manage">
            <OrganizationsPage />
          </PermissionGuard>
        }
      />
      {/* 2.1 Branches & Campuses Master */}
      <Route
        path="branches"
        element={
          <PermissionGuard permission="organizations.manage">
            <BranchesPage />
          </PermissionGuard>
        }
      />
      <Route
        path="organizations/new"
        element={
          <PermissionGuard permission="organizations.manage">
            <NewTenantPage />
          </PermissionGuard>
        }
      />
      <Route
        path="organizations/:id"
        element={
          <PermissionGuard permission="organizations.manage">
            <TenantDetailPage />
          </PermissionGuard>
        }
      />

      {/* 3. User Management */}
      <Route
        path="users"
        element={
          <PermissionGuard permission="settings.user_assignments.allocations.view">
            <UsersPage />
          </PermissionGuard>
        }
      />

      {/* 4. Roles & Permissions */}
      <Route
        path="roles"
        element={
          <PermissionGuard permission="settings.roles_permissions.rbac.view">
            <RolesPage />
          </PermissionGuard>
        }
      />
      <Route
        path="roles/new"
        element={
          <PermissionGuard permission="settings.roles_permissions.rbac.edit">
            <RoleCreatePage />
          </PermissionGuard>
        }
      />
      <Route
        path="roles/:id/matrix"
        element={
          <PermissionGuard permission="settings.roles_permissions.rbac.edit">
            <RoleMatrixPage />
          </PermissionGuard>
        }
      />

      {/* 5. Authentication & Security */}
      <Route
        path="security"
        element={
          <PermissionGuard permission="settings.roles_permissions.rbac.view">
            <SecurityPage />
          </PermissionGuard>
        }
      />

      {/* 6. Subscriptions & Billing */}
      <Route
        path="billing"
        element={
          <PermissionGuard permission="organizations.manage">
            <BillingPage />
          </PermissionGuard>
        }
      />

      {/* 7. Plans & Entitlements */}
      <Route
        path="plans"
        element={
          <PermissionGuard permission="organizations.manage">
            <PlansPage />
          </PermissionGuard>
        }
      />

      {/* 8. Audit & Activity Logs */}
      <Route
        path="audit-logs"
        element={
          <PermissionGuard permission="settings.audit_logs.trail.view">
            <AuditLogsPage />
          </PermissionGuard>
        }
      />

      {/* 9. Tenant Configuration & Integrations */}
      <Route
        path="configuration"
        element={
          <PermissionGuard permission="organizations.manage">
            <TenantConfigurationPage />
          </PermissionGuard>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;

