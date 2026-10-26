import React from 'react';
import { QueryProvider } from './query-provider';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return <QueryProvider>{children}</QueryProvider>;
};
