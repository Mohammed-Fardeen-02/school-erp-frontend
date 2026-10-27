import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, Info } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { ERP_MODULES } from '@/app/config/modules.config';
import { ROUTES } from '@/app/router/routes';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { Breadcrumb } from '@/app/layouts/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/data-display/badge';
import { Card } from '@/components/data-display/card';

export const ModuleContainerPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { getActiveWorkspace } = useAuthStore();
  const activeWorkspace = getActiveWorkspace();

  const moduleDef = ERP_MODULES.find(m => m.id === moduleId) || {
    id: moduleId || 'unknown',
    name: moduleId ? moduleId.charAt(0).toUpperCase() + moduleId.slice(1) : 'Module',
    description: 'School ERP Institutional Domain Module',
    icon: Layers,
    route: `/app/${moduleId}`,
    category: 'core' as const,
    requiredPermission: moduleId || '',
  };

  const Icon = moduleDef.icon;

  return (
    <PageWrapper>
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Workspace', href: ROUTES.WORKSPACE },
          { label: moduleDef.name },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.WORKSPACE)}
            icon={<ArrowLeft className="h-3.5 w-3.5" />}
          >
            Module Switcher
          </Button>
        }
      />

      {/* Module Title Banner */}
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-md shadow-primary/20">
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">
                {moduleDef.name}
              </h1>
              <Badge variant="success">Authorized</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{moduleDef.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-border bg-surface-muted px-3 py-1.5 text-xs font-semibold text-foreground">
            {activeWorkspace?.name || 'Active School'}
          </div>
        </div>
      </div>

      {/* Module Foundation Architecture Status */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card
          header={
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Domain Boundary Isolation</h2>
              <Badge variant="primary">Enforced</Badge>
            </div>
          }
        >
          <div className="space-y-3 text-sm">
            <p className="text-xs text-muted-foreground">
              This module operates within its strictly bounded domain context under tenant isolation
              rules.
            </p>
            <dl className="divide-y divide-border text-xs">
              <div className="flex justify-between py-2">
                <dt className="text-muted-foreground">Domain Identifier</dt>
                <dd className="font-mono font-semibold text-foreground">{moduleDef.id}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-muted-foreground">Feature Directory</dt>
                <dd className="font-mono text-foreground">src/features/{moduleDef.id}/</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-muted-foreground">School Scope</dt>
                <dd className="font-mono text-foreground">{activeWorkspace?.code}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-muted-foreground">Tenant Model</dt>
                <dd className="font-mono text-foreground">Multi-Tenant Isolated Monolith</dd>
              </div>
            </dl>
          </div>
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                Module Implementation Note
              </h2>
              <Badge variant="outline">Architecture Skeleton</Badge>
            </div>
          }
        >
          <div className="flex items-start gap-3 text-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Info className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-foreground font-medium leading-relaxed">
                As per the task specification, business functionality (e.g. data records, student
                admissions, registers, or invoices) is decoupled from this foundation task.
              </p>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Future business modules will be created under{' '}
                <code className="font-mono font-bold text-foreground">
                  src/features/{moduleDef.id}/
                </code>{' '}
                following the 11-step architectural standard.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
};
