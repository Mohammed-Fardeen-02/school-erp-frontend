import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, GraduationCap } from 'lucide-react';
import { useUiStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { sidebarConfig, type SidebarItem } from './sidebar.config';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();
  const { hasModuleAccess, getActiveWorkspace } = useAuthStore();
  const activeWorkspace = getActiveWorkspace();

  const [expandedSections, setExpandedSections] = React.useState<string[]>([
    '/app/students',
    '/app/academics',
  ]);

  const handleNav = (href: string) => {
    navigate(href);
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen(false);
    }
  };

  // Close mobile drawer on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileSidebarOpen, setMobileSidebarOpen]);

  // Prevent background scroll when mobile drawer is open
  React.useEffect(() => {
    if (mobileSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  const toggleSection = (href: string) => {
    setExpandedSections(prev =>
      prev.includes(href) ? prev.filter(item => item !== href) : [...prev, href]
    );
  };

  const isItemActive = (href: string): boolean => {
    if (href === '/workspace') return location.pathname === '/workspace';
    return location.pathname.startsWith(href);
  };

  const isChildActive = (item: SidebarItem): boolean => {
    if (!item.children) return false;
    return item.children.some(child => isItemActive(child.href));
  };

  // Permission-aware sidebar navigation: filter modules by active school permissions
  const visibleNavItems = sidebarConfig.filter(
    item => !item.moduleId || hasModuleAccess(item.moduleId)
  );

  const schoolName = activeWorkspace?.name || 'School Workspace';
  const schoolYear = activeWorkspace?.academicYear
    ? `Academic Year ${activeWorkspace.academicYear}`
    : 'Active Session';
  const schoolInitials = (activeWorkspace?.code || 'SE').slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-surface transition-all duration-300 ease-in-out lg:static ${
          mobileSidebarOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        } ${sidebarCollapsed ? 'lg:w-[64px]' : 'lg:w-60'}`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center border-b border-border px-3">
          <button
            type="button"
            onClick={() => handleNav('/workspace')}
            className={`flex items-center gap-2.5 text-left transition-all duration-300 ${
              sidebarCollapsed ? 'lg:w-full lg:justify-center' : ''
            }`}
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            {(!sidebarCollapsed || mobileSidebarOpen) && (
              <div className="min-w-0 overflow-hidden">
                <div className="truncate text-sm font-bold text-foreground">School ERP</div>
                <div className="truncate text-xs font-medium text-muted-foreground">
                  Enterprise Academic
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Navigation List */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden py-3"
          style={{ scrollbarWidth: 'none' }}
        >
          <nav className={`space-y-1 ${sidebarCollapsed ? 'lg:px-1.5' : 'px-3'}`}>
            {visibleNavItems.map(item => {
              const Icon = item.icon;
              const hasChildren = !!item.children?.length;
              const hasActiveChild = isChildActive(item);
              const isActive = isItemActive(item.href) || hasActiveChild;
              const isExpanded = expandedSections.includes(item.href) || hasActiveChild;
              const isCollapsedDesktop = sidebarCollapsed && !mobileSidebarOpen;

              return (
                <div key={item.href}>
                  <button
                    type="button"
                    onClick={() => {
                      if (hasChildren) {
                        if (!isCollapsedDesktop) {
                          toggleSection(item.href);
                        } else {
                          const targetHref = item.children?.[0]?.href ?? item.href;
                          handleNav(targetHref);
                        }
                      } else {
                        handleNav(item.href);
                      }
                    }}
                    title={isCollapsedDesktop ? item.label : undefined}
                    className={`group flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-all ${
                      isCollapsedDesktop ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'
                    } ${
                      isActive
                        ? 'bg-primary/10 text-primary shadow-xs'
                        : 'text-foreground/70 hover:bg-surface-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />

                    {!isCollapsedDesktop && (
                      <>
                        <span className="flex-1 truncate text-left">{item.label}</span>

                        {item.badge && (
                          <span
                            className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                              isActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {hasChildren &&
                          (isExpanded ? (
                            <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          ))}
                      </>
                    )}
                  </button>

                  {/* Sub Items (expanded state) */}
                  {hasChildren && isExpanded && !isCollapsedDesktop && (
                    <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-2">
                      {item.children!.map(child => {
                        const ChildIcon = child.icon;
                        const isChildActiveItem = isItemActive(child.href);

                        return (
                          <button
                            key={child.href}
                            type="button"
                            onClick={() => handleNav(child.href)}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                              isChildActiveItem
                                ? 'bg-primary/10 font-semibold text-primary'
                                : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground'
                            }`}
                          >
                            {ChildIcon ? (
                              <ChildIcon className="h-3.5 w-3.5 flex-shrink-0" />
                            ) : (
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isChildActiveItem ? 'bg-primary' : 'bg-muted-foreground/40'
                                }`}
                              />
                            )}
                            <span className="flex-1 truncate text-left">{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        {!sidebarCollapsed || mobileSidebarOpen ? (
          <div className="mt-auto border-t border-border p-3">
            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface-muted p-2">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                {schoolInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-foreground" title={schoolName}>
                  {schoolName}
                </div>
                <div className="truncate text-[11px] text-muted-foreground">{schoolYear}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-auto flex justify-center border-t border-border p-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary"
              title={`${schoolName} (${schoolYear})`}
            >
              {schoolInitials}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
