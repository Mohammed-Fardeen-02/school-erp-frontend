import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { PageLoader } from '@/components/feedback/loader';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="relative flex-1 overflow-y-auto bg-background">
          <PageLoader />
          <Outlet />
        </main>
      </div>
    </div>
  );
};
