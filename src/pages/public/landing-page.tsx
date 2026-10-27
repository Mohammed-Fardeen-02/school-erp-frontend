import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Layers,
  Database,
  Lock,
  Sparkles,
  Users,
  CalendarCheck,
  Receipt,
  FileSpreadsheet,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/data-display/badge';
import { StatusBadge } from '@/components/data-display/status-badge';
import { Card } from '@/components/data-display/card';
import { StatsCard } from '@/components/data-display/stats-card';
import { env } from '@/app/config/env';
import { ROUTES } from '@/app/router/routes';
import { useAuthStore } from '@/stores/auth-store';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, activeWorkspaceId } = useAuthStore();

  const handlePrimaryAction = () => {
    if (isAuthenticated) {
      if (activeWorkspaceId) {
        navigate(ROUTES.WORKSPACE);
      } else {
        navigate(ROUTES.SELECT_WORKSPACE);
      }
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  const capabilities = [
    {
      title: 'Academics & Curriculum',
      description:
        'Classes, sections, subjects, syllabus management, and class timetable orchestration.',
      icon: BookOpen,
      status: 'active' as const,
      statusText: 'Core Architecture',
    },
    {
      title: 'Students & Admissions',
      description:
        'Comprehensive student master profiles, enrollment tracking, and guardian contacts.',
      icon: GraduationCap,
      status: 'active' as const,
      statusText: 'Core Architecture',
    },
    {
      title: 'Attendance & Registers',
      description:
        'Daily classroom registers, automated biometric feeds, and attendance analytics.',
      icon: CalendarCheck,
      status: 'published' as const,
      statusText: 'Domain Module',
    },
    {
      title: 'Fees & Finance',
      description:
        'Multi-term fee schedules, customized invoices, receipt issuance, and audit logs.',
      icon: Receipt,
      status: 'published' as const,
      statusText: 'Domain Module',
    },
    {
      title: 'Staff & Human Resources',
      description: 'Teacher profiles, subject allocation matrices, leaves, and staff attendance.',
      icon: Users,
      status: 'published' as const,
      statusText: 'Domain Module',
    },
    {
      title: 'Examinations & Reports',
      description: 'Exam scheduling, hall ticket generation, marks recording, and report cards.',
      icon: FileSpreadsheet,
      status: 'published' as const,
      statusText: 'Domain Module',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Version Pill */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Generation School ERP Architecture</span>
            </div>

            {/* Headline */}
            <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Unified Platform for Modern{' '}
              <span className="bg-gradient-to-r from-primary via-primary-hover to-purple-600 bg-clip-text text-transparent">
                Educational Institutions
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Streamline academic operations, student admissions, attendance registers, and
              financial billing with strict tenant isolation and modular domain design.
            </p>

            {/* CTA Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handlePrimaryAction}
                icon={<ArrowRight className="h-4 w-4" />}
              >
                {isAuthenticated ? 'Open ERP Workspace' : 'Sign In to School ERP'}
              </Button>
              <a href="#capabilities">
                <Button variant="outline" size="lg">
                  Explore Capabilities
                </Button>
              </a>
            </div>

            {/* Application Preview Composition */}
            <div className="mt-14 w-full max-w-5xl rounded-2xl border border-border bg-surface p-4 shadow-2xl shadow-primary/5 sm:p-6">
              <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-danger/80" />
                  <div className="h-3 w-3 rounded-full bg-warning/80" />
                  <div className="h-3 w-3 rounded-full bg-success/80" />
                  <span className="ml-2 font-mono text-xs font-medium text-muted-foreground">
                    school-erp.workspace/preview
                  </span>
                </div>
                <Badge variant="primary">Design System Demo</Badge>
              </div>

              {/* Sample Metric Cards */}
              <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                  title="Enrolled Students"
                  value="1,420"
                  subtitle="Academic Year 2026-27"
                  color="purple"
                  icon={GraduationCap}
                />
                <StatsCard
                  title="Today's Attendance"
                  value="96.4%"
                  subtitle="48 Classes Reported"
                  color="green"
                  icon={CalendarCheck}
                />
                <StatsCard
                  title="Term Invoices"
                  value="$84,200"
                  subtitle="92% Collected"
                  color="blue"
                  icon={Receipt}
                />
                <StatsCard
                  title="Active Faculty"
                  value="86"
                  subtitle="Across 12 Departments"
                  color="rose"
                  icon={Users}
                />
              </div>

              {/* Architecture Foundation Status Verification Block */}
              <div className="mt-6 border-t border-border pt-6 text-left">
                <div className="mb-4">
                  <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    Frontend Architecture Foundation
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Core skeleton, project configuration, and architectural boundaries initialized
                    successfully.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card
                    header={
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">
                          Architecture Status
                        </h3>
                        <Badge variant="success">Initialized</Badge>
                      </div>
                    }
                  >
                    <dl className="divide-y divide-border text-xs">
                      <div className="flex justify-between py-1.5">
                        <dt className="text-muted-foreground">Framework</dt>
                        <dd className="font-mono text-foreground">React 18 + Vite</dd>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <dt className="text-muted-foreground">Type System</dt>
                        <dd className="font-mono text-foreground">TypeScript (Strict Mode)</dd>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <dt className="text-muted-foreground">Server State</dt>
                        <dd className="font-mono text-foreground">TanStack Query v5</dd>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <dt className="text-muted-foreground">Client State</dt>
                        <dd className="font-mono text-foreground">Zustand v5</dd>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <dt className="text-muted-foreground">Forms & Validation</dt>
                        <dd className="font-mono text-foreground">React Hook Form + Zod</dd>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <dt className="text-muted-foreground">Styling</dt>
                        <dd className="font-mono text-foreground">
                          Tailwind CSS v3 + CSS Theme Tokens
                        </dd>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <dt className="text-muted-foreground">Testing</dt>
                        <dd className="font-mono text-foreground">Vitest + RTL</dd>
                      </div>
                    </dl>
                  </Card>

                  <Card
                    header={
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">
                          Configuration & Boundaries
                        </h3>
                        <Badge variant="primary">Enforced</Badge>
                      </div>
                    }
                  >
                    <dl className="divide-y divide-border text-xs">
                      <div className="flex justify-between py-1.5">
                        <dt className="text-muted-foreground">Environment</dt>
                        <dd className="font-mono text-foreground">{env.VITE_APP_ENV}</dd>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <dt className="text-muted-foreground">API Base URL</dt>
                        <dd
                          className="max-w-[180px] truncate font-mono text-foreground"
                          title={env.VITE_API_BASE_URL}
                        >
                          {env.VITE_API_BASE_URL}
                        </dd>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <dt className="text-muted-foreground">API Timeout</dt>
                        <dd className="font-mono text-foreground">{env.VITE_API_TIMEOUT} ms</dd>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <dt className="text-muted-foreground">Feature Modules</dt>
                        <dd className="font-mono text-foreground">0 (Skeleton Only)</dd>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <dt className="text-muted-foreground">Design Tokens</dt>
                        <dd className="font-mono text-foreground">
                          Global CSS Variables (src/styles)
                        </dd>
                      </div>
                    </dl>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Capabilities Section */}
      <section id="capabilities" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Modular Platform Capabilities
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Engineered as bounded domain modules to support institutional scalability.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <StatusBadge status={item.status} label={item.statusText} size="sm" />
                </div>
                <h3 className="mt-4 text-base font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Architecture & Security Highlights */}
      <section id="architecture" className="border-y border-border bg-surface-muted/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Enterprise Architectural Foundation
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Built on clean boundaries, type safety, and multi-tenant security principles.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">Modular Monolith</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Domain isolation with explicit service interfaces and asynchronous event publishing.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">Multi-Tenant Isolation</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                School-scoped data separation with mandatory tenant resolution at route and service
                levels.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">TanStack Server State</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Optimistic updates, background re-validation, and declarative cache key factories.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">Strict Authorization</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Fine-grained role-based access control protecting modules, operations, and views.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-gradient-to-b from-surface to-surface-muted p-8 shadow-xl sm:p-12">
          <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
            Ready to Explore the School ERP Workspace?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Authenticate to test the workspace launcher, multi-school tenant selector, and module
            route guards.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handlePrimaryAction}
              icon={<ArrowRight className="h-4 w-4" />}
            >
              {isAuthenticated ? 'Launch Workspace' : 'Sign In with Demo Credentials'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
