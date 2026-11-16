import React from 'react';
import { QueryProvider } from './query-provider';
import { ToastProvider } from '@/components/feedback/toast';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </QueryProvider>
  );
};
