import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/app/layouts/main-layout';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { Breadcrumb } from '@/app/layouts/breadcrumb';
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
    <PageWrapper>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'System Overview', href: '/' },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Frontend Architecture Foundation
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Core skeleton, project configuration, custom UI design system, and architectural
          boundaries initialized successfully.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card
          header={
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Architecture Status</h2>
              <Badge variant="success">Initialized</Badge>
            </div>
          }
        >
          <dl className="divide-y divide-border text-sm">
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">Framework</dt>
              <dd className="font-mono text-foreground">React 18 + Vite</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">Type System</dt>
              <dd className="font-mono text-foreground">TypeScript (Strict Mode)</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">Server State</dt>
              <dd className="font-mono text-foreground">TanStack Query v5</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">Client State</dt>
              <dd className="font-mono text-foreground">Zustand v5</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">Forms & Validation</dt>
              <dd className="font-mono text-foreground">React Hook Form + Zod</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">Styling</dt>
              <dd className="font-mono text-foreground">Tailwind CSS v3 + CSS Theme Tokens</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">Testing</dt>
              <dd className="font-mono text-foreground">Vitest + RTL</dd>
            </div>
          </dl>
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                Configuration & Boundaries
              </h2>
              <Badge variant="primary">Enforced</Badge>
            </div>
          }
        >
          <dl className="divide-y divide-border text-sm">
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">Environment</dt>
              <dd className="font-mono text-foreground">{env.VITE_APP_ENV}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">API Base URL</dt>
              <dd
                className="max-w-[200px] truncate font-mono text-xs text-foreground"
                title={env.VITE_API_BASE_URL}
              >
                {env.VITE_API_BASE_URL}
              </dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">API Timeout</dt>
              <dd className="font-mono text-foreground">{env.VITE_API_TIMEOUT} ms</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">Feature Modules</dt>
              <dd className="font-mono text-foreground">0 (Skeleton Only)</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">Design Tokens</dt>
              <dd className="font-mono text-foreground">Global CSS Variables (src/styles)</dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="mt-8 rounded-xl border border-warning/30 bg-warning/5 p-4">
        <h3 className="text-sm font-semibold text-warning">Architectural Note</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The <code className="font-mono font-bold text-foreground">src/features/</code> directory
          is intentionally empty of business modules. Business domains (such as Students, Fees,
          Attendance, Academics) must be implemented strictly following the feature module pattern
          defined in{' '}
          <code className="font-mono font-bold text-foreground">
            docs/architecture/FOLDER_STRUCTURE.md
          </code>
          .
        </p>
      </div>
    </PageWrapper>
  );
};

const NotFoundPage: React.FC = () => {
  return (
    <PageWrapper className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="text-4xl font-extrabold text-foreground">404</h2>
      <p className="mt-2 text-base text-muted-foreground">Page not found</p>
    </PageWrapper>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<TechnicalStatusPage />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
