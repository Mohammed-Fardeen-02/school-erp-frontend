export type Nullable<T> = T | null;

export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
