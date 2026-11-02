import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthLayout as FeatureAuthLayout } from '@/features/auth';

export const AuthLayout: React.FC = () => {
  return (
    <FeatureAuthLayout>
      <Outlet />
    </FeatureAuthLayout>
  );
};
