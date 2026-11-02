import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowLeft,
  ShieldCheck,
  BookOpen,
  Users,
  Receipt,
  Lock,
} from 'lucide-react';
import { ROUTES } from '@/app/router/routes';
import { AuthIllustration } from './auth-illustration';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const INSTITUTIONAL_PILLARS = [
  {
    icon: BookOpen,
    label: 'Academic Excellence',
    desc: 'Curriculum & timetable',
  },
  {
    icon: Users,
    label: 'Student Lifecycle',
    desc: 'Admissions to alumni',
  },
  {
    icon: Receipt,
    label: 'Financial Precision',
    desc: 'Invoices & fee gates',
  },
  {
    icon: Lock,
    label: 'Multi-Tenant Security',
    desc: 'Encrypted RBAC',
  },
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <>
      <style>{`
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateX(24px) scale(0.98); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes fadeUpItem {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .auth-card-anim { animation: cardEntrance 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .auth-fade-1 { animation: fadeUpItem 0.5s ease both; }
        .auth-fade-2 { animation: fadeUpItem 0.5s 0.12s ease both; }
        .auth-fade-3 { animation: fadeUpItem 0.5s 0.22s ease both; }
        .auth-fade-4 { animation: fadeUpItem 0.5s 0.32s ease both; }
      `}</style>

      <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background lg:flex-row">
        {/* Return to Landing Link */}
        <div className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6">
          <Link
            to={ROUTES.LANDING}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/80 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Overview
          </Link>
        </div>

        {/* ========================================================
            LEFT PANEL (Desktop Showcase - 60% Width)
            ======================================================== */}
        <div className="hidden lg:relative lg:flex lg:w-[60%] lg:flex-col lg:justify-between lg:overflow-hidden lg:border-r lg:border-border lg:bg-gradient-to-br lg:from-primary-ghost/40 lg:via-background lg:to-primary-ghost/20 lg:p-10 lg:pt-16 xl:p-12 xl:pt-20">
          {/* Brand Logo & Title */}
          <div className="auth-fade-1 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-md shadow-primary/25">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-foreground">School ERP</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Institutional Workspace Platform
              </div>
            </div>
          </div>

          {/* Hero Pitch */}
          <div className="auth-fade-2 mt-6 max-w-xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground xl:text-4xl">
              Educate. Empower.{' '}
              <span className="bg-gradient-to-r from-primary via-purple-600 to-indigo-500 bg-clip-text text-transparent">
                Elevate. Everywhere.
              </span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A unified institutional operating system unifying academic schedules, student records, fee
              settlements, and administrative governance with zero friction.
            </p>
          </div>

          {/* Center Graphic */}
          <div className="auth-fade-3 my-auto flex-1">
            <AuthIllustration />
          </div>

          {/* Bottom Pillar Strip */}
          <div className="auth-fade-4 mt-6 grid grid-cols-2 gap-3 border-t border-primary/10 pt-5 xl:grid-cols-4">
            {INSTITUTIONAL_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold text-foreground">{pillar.label}</div>
                    <div className="truncate text-[10px] text-muted-foreground">{pillar.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            RIGHT PANEL (Interactive Form - 40% Width on Desktop)
            ======================================================== */}
        <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="auth-card-anim w-full max-w-md">
            {/* Mobile Header (visible only on small screens) */}
            <div className="mb-6 flex flex-col items-center text-center lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-md shadow-primary/20">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-foreground">
                School ERP
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Institutional Academic & Management System
              </p>
            </div>

            {/* Auth Form Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-black/5 sm:p-8">
              {children}
            </div>

            {/* Development Mock Notice */}
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary">
                <ShieldCheck className="h-4 w-4" />
                Development Mock Mode
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Isolated frontend authentication adapter. Real backend auth service integration pending.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
