import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Search, LogOut } from 'lucide-react';
import { ROUTES } from '@/app/router/routes';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';

export interface WorkspaceHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSchoolSwitcher?: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const navigate = useNavigate();
  const { user, getActiveWorkspace, logout } = useAuthStore();
  const activeWorkspace = getActiveWorkspace();

  const userInitials = user
    ? `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase()
    : 'A';

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: School ERP Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary-hover to-primary-dark text-white shadow-md shadow-primary/20">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-foreground">
                School ERP
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Workspace
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{activeWorkspace?.name || "St. Mary's High School"}</span>
              <span>•</span>
              <span>{activeWorkspace?.academicYear || '2026-2027'}</span>
            </div>
          </div>
        </div>

        {/* Center: Search / Filter input */}
        <div className="max-w-md flex-1">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search modules, actions, shortcuts... (Press '/' to focus)"
              className="w-full rounded-xl border border-border bg-surface-muted/60 py-2 pl-10 pr-12 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <kbd className="hidden sm:inline-block rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary ring-2 ring-primary/20">
              {userInitials}
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-xs font-bold text-foreground">
                {user ? `${user.firstName} ${user.lastName}` : 'Administrator'}
              </div>
              <div className="text-[10px] font-medium text-muted-foreground capitalize">
                {user?.role.toLowerCase().replace('_', ' ') || 'Admin'}
              </div>
            </div>
          </div>

          <div className="h-5 w-px bg-border/80 mx-1 hidden sm:block" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-9 w-9 p-0 text-muted-foreground hover:text-danger hover:bg-danger/10"
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
