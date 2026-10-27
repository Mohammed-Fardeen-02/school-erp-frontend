import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronDown,
  Building2,
  LogOut,
  Shield,
  Settings,
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { useUiStore } from '@/stores/ui-store';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { pageTitle, pageSubtitle, theme, setTheme, toggleSidebar, toggleMobileSidebar } =
    useUiStore();

  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [unreadNotifications] = React.useState(3);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close profile menu on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleMenu = () => {
    if (window.innerWidth < 1024) {
      toggleMobileSidebar();
    } else {
      toggleSidebar();
    }
  };

  const handleSignOut = () => {
    setShowProfileMenu(false);
    navigate('/');
  };

  const userName = 'Administrator';
  const userEmail = 'admin@schoolerp.io';
  const userInitials = 'AD';
  const schoolName = "St. Mary's Academy";
  const roleName = 'Principal / Superadmin';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left side: Hamburger toggle + dynamic title/subtitle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleToggleMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-base font-bold text-foreground sm:text-lg">{pageTitle}</h1>
          {pageSubtitle && (
            <p className="hidden text-xs text-muted-foreground sm:block">{pageSubtitle}</p>
          )}
        </div>
      </div>

      {/* Right side: School badge, theme selector, notification bell, user profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* School Tenant Badge */}
        <div className="hidden items-center gap-1.5 rounded-lg border border-border bg-surface-muted px-2.5 py-1 text-xs font-semibold text-foreground md:flex">
          <Building2 className="h-3.5 w-3.5 text-primary" />
          <span className="truncate max-w-[150px]">{schoolName}</span>
        </div>

        {/* Theme mode buttons */}
        <div className="hidden items-center rounded-lg border border-border bg-surface-muted p-0.5 sm:flex">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`rounded-md p-1.5 text-xs transition-colors ${
              theme === 'light'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Light Theme"
            aria-label="Light Theme"
          >
            <Sun className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`rounded-md p-1.5 text-xs transition-colors ${
              theme === 'dark'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Dark Theme"
            aria-label="Dark Theme"
          >
            <Moon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`rounded-md p-1.5 text-xs transition-colors ${
              theme === 'system'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="System Theme"
            aria-label="System Theme"
          >
            <Laptop className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-white shadow-xs">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </button>
        </div>

        {/* User Profile Card Popover */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 rounded-xl border border-transparent py-1.5 pl-2 pr-3 transition-all hover:border-border hover:bg-surface-muted focus:outline-none"
            aria-expanded={showProfileMenu}
            aria-haspopup="true"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-xs font-black text-white shadow-xs">
              {userInitials}
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-xs font-bold leading-tight text-foreground">{userName}</div>
              <div className="max-w-[110px] truncate text-[10px] font-medium text-muted-foreground">
                {roleName}
              </div>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                showProfileMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Profile Dropdown Popover */}
          {showProfileMenu && (
            <div className="absolute right-0 z-50 mt-2.5 w-80 divide-y divide-border rounded-2xl border border-border bg-surface p-4 shadow-2xl animate-in fade-in-0 zoom-in-95">
              {/* User Header */}
              <div className="flex items-start gap-3 pb-3.5">
                <div className="relative shrink-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-sm font-black text-white shadow-sm">
                    {userInitials}
                  </div>
                  <span
                    className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface bg-emerald-500"
                    title="Online"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-bold text-foreground" title={userName}>
                    {userName}
                  </h4>
                  <p className="truncate font-mono text-xs text-muted-foreground" title={userEmail}>
                    {userEmail}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Active Session
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges for Role & School Tenant */}
              <div className="space-y-2 py-3">
                <div className="flex items-center justify-between rounded-xl border border-border bg-surface-muted p-2.5 text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                    <Shield className="h-3.5 w-3.5 text-primary" />
                    Role
                  </span>
                  <span className="max-w-[140px] truncate rounded-lg border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary-dark">
                    {roleName}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border bg-surface-muted p-2.5 text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 text-info" />
                    School
                  </span>
                  <span className="max-w-[140px] truncate rounded-lg border border-border bg-surface px-2 py-0.5 text-[11px] font-bold text-foreground">
                    {schoolName}
                  </span>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="space-y-1 py-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                  className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-muted"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                    School Settings
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                </button>
              </div>

              {/* Sign Out Button */}
              <div className="pt-2.5">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-danger/20 px-3 py-2.5 text-xs font-bold text-danger transition-colors hover:bg-danger/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
