export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  SELECT_WORKSPACE: '/select-workspace',
  WORKSPACE: '/workspace',
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
