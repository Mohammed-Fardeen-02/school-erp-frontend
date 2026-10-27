import { create } from 'zustand';
import type { ThemeMode } from '@/types/common.types';

interface UiState {
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  pageTitle: string;
  pageSubtitle: string;
  setTheme: (theme: ThemeMode) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setHeaderTitle: (title: string, subtitle?: string) => void;
}

export const useUiStore = create<UiState>(set => ({
  theme: 'system',
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  pageTitle: 'School ERP',
  pageSubtitle: '',
  setTheme: theme => set({ theme }),
  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: collapsed => set({ sidebarCollapsed: collapsed }),
  toggleMobileSidebar: () => set(state => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
  setMobileSidebarOpen: open => set({ mobileSidebarOpen: open }),
  setHeaderTitle: (title, subtitle = '') => set({ pageTitle: title, pageSubtitle: subtitle }),
}));
