import * as React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { ERP_MODULES } from '@/app/config/modules.config';
import { useAuthStore } from '@/stores/auth-store';
import { WorkspaceHeader, AppIconTile } from '../components';

const CATEGORIES = [
  { id: 'all', label: 'All Modules' },
  { id: 'academic', label: 'Academic Core' },
  { id: 'administrative', label: 'Administration' },
  { id: 'financial', label: 'Finance' },
  { id: 'core', label: 'Campus Life' },
  { id: 'system', label: 'System' },
];

export const WorkspaceLauncherPage: React.FC = () => {
  const { hasModuleAccess, getActiveWorkspace } = useAuthStore();
  const activeWorkspace = getActiveWorkspace();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  // Filter modules by search and category
  const filteredModules = ERP_MODULES.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.shortName && m.shortName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.shortcuts?.some(sc => sc.label.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    return m.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Sleek School ERP Desk Header */}
      <WorkspaceHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Subtle Workspace Title & Filter Controls */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Accessible Modules & Workspaces
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {filteredModules.length} Accessible
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Tenant access provisioned for <span className="font-semibold text-foreground">{activeWorkspace?.name || "St. Mary's High School"}</span>. Select an accessible module to orchestrate operations.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-surface-muted/60 p-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-surface text-primary shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Squircle Apps Launcher Grid - 6 columns on desktop */}
        {filteredModules.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-x-6 sm:gap-x-10 gap-y-10 sm:gap-y-12 justify-items-center items-start pt-2 pb-16">
            {filteredModules.map(module => (
              <AppIconTile
                key={module.id}
                module={module}
                isPermitted={hasModuleAccess(module.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/60 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-foreground">No matching modules found</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              No module matched your search query "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs font-semibold text-primary hover:underline"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
