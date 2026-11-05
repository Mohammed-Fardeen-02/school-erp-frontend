import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ROUTES } from './routes';
import { PublicLayout } from '@/app/layouts/public-layout';
import { MainLayout } from '@/app/layouts/main-layout';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AuthGuard } from '@/app/guards/auth-guard';
import { GuestGuard } from '@/app/guards/guest-guard';
import { WorkspaceGuard } from '@/app/guards/workspace-guard';
import { ModuleAccessGuard } from '@/app/guards/module-access-guard';
import { LandingPage } from '@/pages/public/landing-page';
import { ModuleContainerPage } from '@/pages/module/module-container-page';
import { LoginPage, ForgotPasswordPage, ResetPasswordPage } from '@/features/auth';
import { WorkspaceLauncherPage, SelectWorkspacePage } from '@/features/workspace';
import { TenantsRoutes } from '@/features/tenants';
import { RolesRoutes } from '@/features/roles';
import { UsersRoutes } from '@/features/users';
import { Button } from '@/components/ui/button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-24 text-center">
      <PageWrapper className="flex flex-col items-center">
        <span className="font-mono text-6xl font-extrabold text-primary">404</span>
        <h2 className="mt-4 text-2xl font-extrabold text-foreground sm:text-3xl">Page Not Found</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          The requested route does not exist within the School ERP application shell.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to={ROUTES.LANDING}>
            <Button variant="outline" size="sm">
              Return Home
            </Button>
          </Link>
          <Link to={ROUTES.WORKSPACE}>
            <Button variant="primary" size="sm">
              Go to Workspace
            </Button>
          </Link>
        </div>
      </PageWrapper>
    </div>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Marketing Landing Page */}
      <Route path={ROUTES.LANDING} element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
      </Route>

      {/* 2. Authentication Flow (Guest Only, Feature-driven) */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        }
      />
      <Route
        path={ROUTES.FORGOT_PASSWORD}
        element={
          <GuestGuard>
            <ForgotPasswordPage />
          </GuestGuard>
        }
      />
      <Route
        path={ROUTES.RESET_PASSWORD}
        element={
          <GuestGuard>
            <ResetPasswordPage />
          </GuestGuard>
        }
      />

      {/* 3. Conditional Campus / Workspace Selection (Authenticated) */}
      <Route
        path={ROUTES.SELECT_WORKSPACE}
        element={
          <AuthGuard>
            <SelectWorkspacePage />
          </AuthGuard>
        }
      />

      {/* 4. Authenticated ERPNext-Style Module Launcher Desk */}
      <Route
        path={ROUTES.WORKSPACE}
        element={
          <AuthGuard>
            <WorkspaceGuard>
              <WorkspaceLauncherPage />
            </WorkspaceGuard>
          </AuthGuard>
        }
      />

      {/* 5. Authenticated Feature Workspace (MainLayout with Sidebar & Navigation) */}
      <Route
        element={
          <AuthGuard>
            <WorkspaceGuard>
              <MainLayout />
            </WorkspaceGuard>
          </AuthGuard>
        }
      >
        {/* Modular Feature Sub-Routers */}
        <Route path="/tenants/*" element={<TenantsRoutes />} />
        <Route path="/roles/*" element={<RolesRoutes />} />
        <Route path="/users/*" element={<UsersRoutes />} />

        {/* Catch-All Business Module Container */}
        <Route
          path={ROUTES.APP_MODULE}
          element={
            <ModuleAccessGuard>
              <ModuleContainerPage />
            </ModuleAccessGuard>
          }
        />
      </Route>

      {/* 6. Fallback 404 Route */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
};
