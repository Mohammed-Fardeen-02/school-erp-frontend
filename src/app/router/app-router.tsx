import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ROUTES } from './routes';
import { PublicLayout } from '@/app/layouts/public-layout';
import { AuthLayout } from '@/app/layouts/auth-layout';
import { MainLayout } from '@/app/layouts/main-layout';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AuthGuard } from '@/app/guards/auth-guard';
import { GuestGuard } from '@/app/guards/guest-guard';
import { WorkspaceGuard } from '@/app/guards/workspace-guard';
import { ModuleAccessGuard } from '@/app/guards/module-access-guard';
import { LandingPage } from '@/pages/public/landing-page';
import { LoginPage } from '@/pages/auth/login-page';
import { ForgotPasswordPage } from '@/pages/auth/forgot-password-page';
import { ResetPasswordPage } from '@/pages/auth/reset-password-page';
import { SelectWorkspacePage } from '@/pages/workspace/select-workspace-page';
import { WorkspaceLauncherPage } from '@/pages/workspace/workspace-launcher-page';
import { ModuleContainerPage } from '@/pages/module/module-container-page';
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

      {/* 2. Authentication Flow (Guest Only) */}
      <Route
        element={
          <GuestGuard>
            <AuthLayout />
          </GuestGuard>
        }
      >
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      </Route>

      {/* 3. Conditional Workspace Selection (Authenticated) */}
      <Route
        path={ROUTES.SELECT_WORKSPACE}
        element={
          <AuthGuard>
            <SelectWorkspacePage />
          </AuthGuard>
        }
      />

      {/* 4. Authenticated Workspace Launcher & Module Shell */}
      <Route
        element={
          <AuthGuard>
            <WorkspaceGuard>
              <MainLayout />
            </WorkspaceGuard>
          </AuthGuard>
        }
      >
        <Route path={ROUTES.WORKSPACE} element={<WorkspaceLauncherPage />} />
        <Route
          path={ROUTES.APP_MODULE}
          element={
            <ModuleAccessGuard>
              <ModuleContainerPage />
            </ModuleAccessGuard>
          }
        />
      </Route>

      {/* 5. Fallback 404 Route */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
};
