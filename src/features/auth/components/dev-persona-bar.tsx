import * as React from 'react';
import { UserCheck, Shield, Building2, BookOpen } from 'lucide-react';

export interface DevPersonaBarProps {
  onSelectPersona: (email: string, pass: string) => void;
}

export const DevPersonaBar: React.FC<DevPersonaBarProps> = ({ onSelectPersona }) => {
  return (
    <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
        <UserCheck className="h-4 w-4" />
        Quick-Fill Credentials (Live & Dev)
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Select a credential below to auto-fill the login form:
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onSelectPersona('admin@erp.com', 'Admin@123')}
          className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-white px-2 py-1 text-[11px] font-semibold text-primary shadow-xs transition-colors hover:bg-primary-ghost"
        >
          <Shield className="h-3 w-3" />
          Platform Super Admin
        </button>
        <button
          type="button"
          onClick={() => onSelectPersona('orgadmin@greenwood.edu', 'Admin@123')}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-2 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-surface-muted"
        >
          <Building2 className="h-3 w-3 text-primary" />
          Greenwood Trust Owner
        </button>
        <button
          type="button"
          onClick={() => onSelectPersona('admin@schoolerp.io', 'Password123!')}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-surface-muted"
        >
          <Shield className="h-3 w-3" />
          Multi-School Admin
        </button>
        <button
          type="button"
          onClick={() => onSelectPersona('teacher@schoolerp.io', 'Password123!')}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-surface-muted"
        >
          <BookOpen className="h-3 w-3" />
          Single-School Teacher
        </button>
      </div>
    </div>
  );
};
