import type { RouteObject } from 'react-router-dom';
import { LoginPage, ForgotPasswordPage, ResetPasswordPage } from './pages';
import { GuestGuard } from '@/app/guards/guest-guard';

export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <GuestGuard>
        <ForgotPasswordPage />
      </GuestGuard>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <GuestGuard>
        <ResetPasswordPage />
      </GuestGuard>
    ),
  },
];
