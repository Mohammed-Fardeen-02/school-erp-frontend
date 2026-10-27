import * as React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/app/router/routes';

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Return to Landing Link */}
      <div className="absolute left-4 top-4 sm:left-8 sm:top-8">
        <Link
          to={ROUTES.LANDING}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Overview
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Icon & Heading */}
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-md shadow-primary/20">
            <GraduationCap className="h-7 w-7" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          School ERP
        </h2>
        <p className="mt-1 text-center text-xs text-muted-foreground sm:text-sm">
          Unified Academic & Institutional Management System
        </p>
      </div>

      {/* Card Content */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-black/5 sm:p-8">
          <Outlet />
        </div>

        {/* Development Mock Notice */}
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary">
            <ShieldCheck className="h-4 w-4" />
            Development Mock Mode
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Using isolated mock authentication. Real backend auth service integration pending.
          </p>
        </div>
      </div>
    </div>
  );
};
