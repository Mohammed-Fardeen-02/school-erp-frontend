import { create } from 'zustand';
import type { ThemeMode } from '@/types/common.types';

interface UiState {
  theme: ThemeMode;
  sidebarOpen: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>(set => ({
  theme: 'system',
  sidebarOpen: true,
  setTheme: theme => set({ theme }),
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: open => set({ sidebarOpen: open }),
}));
