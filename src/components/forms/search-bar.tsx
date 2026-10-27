import { Search, X, Filter, LayoutList, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'list' | 'grid';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showFilters?: boolean;
  onFilterClick?: () => void;
  filterCount?: number;
  showViewToggle?: boolean;
  viewMode?: ViewMode;
  onViewChange?: (mode: ViewMode) => void;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  showFilters = false,
  onFilterClick,
  filterCount = 0,
  showViewToggle = false,
  viewMode = 'list',
  onViewChange,
  className = '',
}: SearchBarProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showFilters && (
        <div className="relative">
          <button
            type="button"
            onClick={onFilterClick}
            className="inline-flex items-center gap-1.5 h-9 px-3 text-sm font-medium bg-surface border border-border rounded-lg text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {filterCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {filterCount}
              </span>
            )}
          </button>
        </div>
      )}

      {showViewToggle && onViewChange && (
        <div className="flex items-center border border-border rounded-lg overflow-hidden bg-surface">
          <button
            type="button"
            onClick={() => onViewChange('list')}
            className={cn(
              'p-2 transition-colors cursor-pointer',
              viewMode === 'list'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-surface-muted'
            )}
            title="List View"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange('grid')}
            className={cn(
              'p-2 transition-colors cursor-pointer',
              viewMode === 'grid'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-surface-muted'
            )}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-56 pl-9 pr-8 h-9 text-sm bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
