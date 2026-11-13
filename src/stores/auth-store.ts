import { create } from 'zustand';
import type { User, SchoolWorkspace, LoginCredentials } from '@/features/auth/types';
import { AuthApi } from '@/features/auth/api';
import { apiClient } from '@/lib/api-client';
import { queryClient } from '@/lib/query-client';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null; // Stored strictly in memory, never persisted
  user: User | null;
  workspaces: SchoolWorkspace[];
  activeWorkspaceId: string | null;
  activeLocationId: string | null;
  isInitialized: boolean;
  login: (credentials: LoginCredentials) => Promise<{ workspaceCount: number }>;
  logout: () => Promise<void>;
  setActiveWorkspace: (workspaceId: string, locationId?: string) => void;
  setTenantContext: (organizationId: string | null, locationId?: string | null) => void;
  getActiveWorkspace: () => SchoolWorkspace | null;
  hasModuleAccess: (moduleId: string) => boolean;
}

const STORAGE_KEY = 'school_erp_auth_session';

interface StoredSession {
  user: User;
  workspaces: SchoolWorkspace[];
  activeWorkspaceId: string | null;
  activeLocationId?: string | null;
  token?: string | null;
}

const loadSession = (): StoredSession | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
};

const saveSession = (session: StoredSession | null) => {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Silent fallback
  }
};

const initialSession = loadSession();
const initialActiveId =
  initialSession?.activeWorkspaceId ?? (initialSession?.workspaces?.[0]?.id ?? null);
const initialLocationId = initialSession?.activeLocationId ?? null;

// Initialize apiClient with token and tenant headers if saved session exists
if (initialSession?.token) {
  apiClient.setToken(initialSession.token);
}
if (initialActiveId) {
  apiClient.setTenantContext(initialActiveId, initialLocationId);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: !!initialSession?.user,
  accessToken: initialSession?.token ?? null,
  user: initialSession?.user ?? null,
  workspaces: initialSession?.workspaces ?? [],
  activeWorkspaceId: initialActiveId,
  activeLocationId: initialLocationId,
  isInitialized: true,

  login: async (credentials: LoginCredentials) => {
    const response = await AuthApi.login(credentials);
    const { user, workspaces, token } = response;

    // Auto-select first workspace by default so school selection screen is bypassed
    const autoActiveId = workspaces.length > 0 && workspaces[0] ? workspaces[0].id : null;

    if (token) {
      apiClient.setToken(token);
    }
    apiClient.setTenantContext(autoActiveId, null);

    set({
      isAuthenticated: true,
      accessToken: token || null,
      user,
      workspaces,
      activeWorkspaceId: autoActiveId,
      activeLocationId: null,
    });

    saveSession({
      user,
      workspaces,
      activeWorkspaceId: autoActiveId,
      activeLocationId: null,
      token: token || null,
    });

    return { workspaceCount: workspaces.length };
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
    saveSession(null);
    apiClient.setToken(null);
    apiClient.setTenantContext(null, null);
    queryClient.clear();

    set({
      isAuthenticated: false,
      accessToken: null,
      user: null,
      workspaces: [],
      activeWorkspaceId: null,
      activeLocationId: null,
    });
  },

  setActiveWorkspace: (workspaceId: string, locationId?: string) => {
    const { user, workspaces } = get();
    const exists = workspaces.some(w => w.id === workspaceId);
    if (!exists) return;

    // Abort inflight queries and purge tenant cache to prevent cross-tenant data leaks
    queryClient.cancelQueries();
    queryClient.removeQueries({ queryKey: ['tenant'] });

    const chosenLocId = locationId ?? null;
    apiClient.setTenantContext(workspaceId, chosenLocId);

    set({
      activeWorkspaceId: workspaceId,
      activeLocationId: chosenLocId,
    });

    if (user) {
      saveSession({
        user,
        workspaces,
        activeWorkspaceId: workspaceId,
        activeLocationId: chosenLocId,
        token: get().accessToken,
      });
    }
  },

  setTenantContext: (organizationId: string | null, locationId?: string | null) => {
    queryClient.cancelQueries();
    queryClient.removeQueries({ queryKey: ['tenant'] });

    apiClient.setTenantContext(organizationId, locationId ?? null);
    set({
      activeWorkspaceId: organizationId,
      activeLocationId: locationId ?? null,
    });
  },

  getActiveWorkspace: () => {
    const { workspaces, activeWorkspaceId } = get();
    return (
      (activeWorkspaceId ? workspaces.find(w => w.id === activeWorkspaceId) : null) ??
      workspaces[0] ??
      null
    );
  },

  hasModuleAccess: (moduleId: string) => {
    const { workspaces, activeWorkspaceId, user } = get();
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN') {
      return true;
    }
    const activeWs =
      (activeWorkspaceId ? workspaces.find(w => w.id === activeWorkspaceId) : null) ??
      workspaces[0];
    if (!activeWs) return false;
    const modules =
      activeWs.permittedModules ||
      (activeWs as { enabledModules?: string[] }).enabledModules ||
      [];

    // Module aliases
    if (moduleId === 'accounting' && (modules.includes('fees') || modules.includes('accounting'))) return true;
    if (moduleId === 'people-ops' && (modules.includes('staff') || modules.includes('people-ops'))) return true;
    if (moduleId === 'erpnext-settings' && (modules.includes('settings') || modules.includes('erpnext-settings'))) return true;
    if (moduleId === 'frappe-hr' && (modules.includes('staff') || modules.includes('hr') || modules.includes('frappe-hr'))) return true;

    return modules.includes(moduleId);
  },
}));
