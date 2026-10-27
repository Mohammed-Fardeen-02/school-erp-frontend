import { create } from 'zustand';
import type { User, SchoolWorkspace, LoginCredentials } from '@/types/auth.types';
import { authService } from '@/services/auth.service';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  workspaces: SchoolWorkspace[];
  activeWorkspaceId: string | null;
  isInitialized: boolean;
  login: (credentials: LoginCredentials) => Promise<{ workspaceCount: number }>;
  logout: () => Promise<void>;
  setActiveWorkspace: (workspaceId: string) => void;
  getActiveWorkspace: () => SchoolWorkspace | null;
  hasModuleAccess: (moduleId: string) => boolean;
}

const STORAGE_KEY = 'school_erp_auth_session';

interface StoredSession {
  user: User;
  workspaces: SchoolWorkspace[];
  activeWorkspaceId: string | null;
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

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: !!initialSession?.user,
  user: initialSession?.user ?? null,
  workspaces: initialSession?.workspaces ?? [],
  activeWorkspaceId: initialSession?.activeWorkspaceId ?? null,
  isInitialized: true,

  login: async (credentials: LoginCredentials) => {
    const { user, workspaces } = await authService.login(credentials);

    // Auto-select workspace if user has exactly one workspace
    const autoActiveId = workspaces.length === 1 && workspaces[0] ? workspaces[0].id : null;

    set({
      isAuthenticated: true,
      user,
      workspaces,
      activeWorkspaceId: autoActiveId,
    });

    saveSession({
      user,
      workspaces,
      activeWorkspaceId: autoActiveId,
    });

    return { workspaceCount: workspaces.length };
  },

  logout: async () => {
    await authService.logout();
    set({
      isAuthenticated: false,
      user: null,
      workspaces: [],
      activeWorkspaceId: null,
    });
    saveSession(null);
  },

  setActiveWorkspace: (workspaceId: string) => {
    const { user, workspaces } = get();
    const exists = workspaces.some(w => w.id === workspaceId);
    if (!exists) return;

    set({ activeWorkspaceId: workspaceId });
    if (user) {
      saveSession({
        user,
        workspaces,
        activeWorkspaceId: workspaceId,
      });
    }
  },

  getActiveWorkspace: () => {
    const { workspaces, activeWorkspaceId } = get();
    return workspaces.find(w => w.id === activeWorkspaceId) ?? null;
  },

  hasModuleAccess: (moduleId: string) => {
    const { workspaces, activeWorkspaceId } = get();
    const activeWs = workspaces.find(w => w.id === activeWorkspaceId);
    if (!activeWs) return false;
    return activeWs.enabledModules.includes(moduleId);
  },
}));
