import { useAuthStore } from '@/stores/auth-store';

export const useAuth = () => {
  const {
    isAuthenticated,
    user,
    workspaces,
    activeWorkspaceId,
    isInitialized,
    login,
    logout,
    setActiveWorkspace,
    getActiveWorkspace,
    hasModuleAccess,
  } = useAuthStore();

  return {
    isAuthenticated,
    user,
    workspaces,
    activeWorkspaceId,
    activeWorkspace: getActiveWorkspace(),
    isInitialized,
    login,
    logout,
    setActiveWorkspace,
    getActiveWorkspace,
    hasModuleAccess,
  };
};
