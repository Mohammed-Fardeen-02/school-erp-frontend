export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  SELECT_WORKSPACE: '/select-workspace',
  WORKSPACE: '/workspace',
  ADMIN: '/admin',
  ADMIN_ORGANIZATIONS: '/admin/organizations',
  ADMIN_USERS: '/admin/users',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_ROLES_NEW: '/admin/roles/new',
  ADMIN_ROLE_MATRIX: '/admin/roles/:id/matrix',
  ADMIN_SECURITY: '/admin/security',
  ADMIN_BILLING: '/admin/billing',
  ADMIN_PLANS: '/admin/plans',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',
  TENANTS: '/tenants',
  USERS: '/users',
  ROLES: '/roles',
  SETTINGS: '/settings',
  APP_MODULE: '/app/:moduleId/*',
  NOT_FOUND: '*',
} as const;

export const buildModuleRoute = (moduleId: string, subPath = '') => {
  const base = `/app/${moduleId}`;
  return subPath ? `${base}/${subPath.replace(/^\//, '')}` : base;
};
