import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '@/app/layouts/root-layout';
import { ROUTES } from './routes';
import { Card } from '@/components/data-display/card';
import { Badge } from '@/components/data-display/badge';
import { env } from '@/app/config/env';

/**
 * Minimal Technical Shell & Status Verification Page
 * Note: This is strictly a technical verification component and does NOT represent
 * a business feature or ERP dashboard.
 */
const TechnicalStatusPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Frontend Architecture Foundation
        </h1>
        <p className="mt-2 text-base text-slate-600">
          Core skeleton, project configuration, and architectural boundaries initialized
          successfully.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card
          header={
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Architecture Status</h2>
              <Badge variant="success">Initialized</Badge>
            </div>
          }
        >
          <dl className="divide-y divide-slate-100 text-sm">
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Framework</dt>
              <dd className="font-mono text-slate-800">React 18 + Vite</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Type System</dt>
              <dd className="font-mono text-slate-800">TypeScript (Strict Mode)</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Server State</dt>
              <dd className="font-mono text-slate-800">TanStack Query v5</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Client State</dt>
              <dd className="font-mono text-slate-800">Zustand v5</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Forms & Validation</dt>
              <dd className="font-mono text-slate-800">React Hook Form + Zod</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Styling</dt>
              <dd className="font-mono text-slate-800">Tailwind CSS v3</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Testing</dt>
              <dd className="font-mono text-slate-800">Vitest + RTL</dd>
            </div>
          </dl>
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Configuration & Boundaries</h2>
              <Badge variant="primary">Enforced</Badge>
            </div>
          }
        >
          <dl className="divide-y divide-slate-100 text-sm">
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Environment</dt>
              <dd className="font-mono text-slate-800">{env.VITE_APP_ENV}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">API Base URL</dt>
              <dd
                className="font-mono text-xs text-slate-800 truncate max-w-[200px]"
                title={env.VITE_API_BASE_URL}
              >
                {env.VITE_API_BASE_URL}
              </dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">API Timeout</dt>
              <dd className="font-mono text-slate-800">{env.VITE_API_TIMEOUT} ms</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Feature Modules</dt>
              <dd className="font-mono text-slate-800">0 (Skeleton Only)</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Linting & Formatting</dt>
              <dd className="font-mono text-slate-800">ESLint Flat + Prettier</dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <h3 className="text-sm font-semibold text-amber-900">Architectural Note</h3>
        <p className="mt-1 text-sm text-amber-800">
          The <code className="font-mono font-bold">src/features/</code> directory is intentionally
          empty of business modules. Business domains (such as Students, Fees, Attendance,
          Academics) must be implemented strictly following the feature module pattern defined in{' '}
          <code className="font-mono font-bold">docs/architecture/FOLDER_STRUCTURE.md</code>.
        </p>
      </div>
    </div>
  );
};

const NotFoundPage: React.FC = () => {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
      <h2 className="text-4xl font-extrabold text-slate-900">404</h2>
      <p className="mt-2 text-base text-slate-600">Page not found</p>
    </div>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<TechnicalStatusPage />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
