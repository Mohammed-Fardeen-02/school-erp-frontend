import type { RouteObject } from 'react-router-dom';
import { WorkspaceLauncherPage, SelectWorkspacePage } from './pages';
import { AuthGuard } from '@/app/guards/auth-guard';
import { WorkspaceGuard } from '@/app/guards/workspace-guard';

export const workspaceRoutes: RouteObject[] = [
  {
    path: '/select-workspace',
    element: (
      <AuthGuard>
        <SelectWorkspacePage />
      </AuthGuard>
    ),
  },
  {
    path: '/workspace',
    element: (
      <AuthGuard>
        <WorkspaceGuard>
          <WorkspaceLauncherPage />
        </WorkspaceGuard>
      </AuthGuard>
    ),
  },
];
