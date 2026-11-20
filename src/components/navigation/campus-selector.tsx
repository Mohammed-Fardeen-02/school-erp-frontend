import * as React from 'react';
import {
  MapPin,
  ChevronDown,
  Check,
  Building2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useCampusContext } from '@/features/workspace/hooks/use-campus-context';
import { Badge } from '@/components/data-display/badge';

export interface CampusSelectorProps {
  className?: string;
  variant?: 'header' | 'compact';
}

export const CampusSelector: React.FC<CampusSelectorProps> = ({
  className = '',
  variant = 'header',
}) => {
  const {
    campuses,
    activeCampus,
    activeLocationId,
    isSingleCampus,
    isLoading,
    isError,
    error,
    isSwitching,
    switchCampus,
    refetch,
  } = useCampusContext();

  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const optionsRef = React.useRef<(HTMLButtonElement | null)[]>([]);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isSingleCampus || isSwitching) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % campuses.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev <= 0 ? campuses.length - 1 : prev - 1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < campuses.length) {
          const selected = campuses[highlightedIndex];
          if (selected) {
            handleSelectCampus(selected.id);
          }
        }
        break;
    }
  };

  const handleSelectCampus = async (locationId: string) => {
    if (locationId === activeLocationId) {
      setIsOpen(false);
      return;
    }

    const success = await switchCampus(locationId);
    if (success) {
      setIsOpen(false);
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div
        data-testid="campus-selector-loading"
        className={`inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface-muted/40 px-2 py-1 text-xs text-muted-foreground ${className}`}
      >
        <Loader2 className="h-3 w-3 animate-spin text-primary" />
        <span className="text-[11px]">Loading campus...</span>
      </div>
    );
  }

  // 2. Error State with Retry
  if (isError) {
    return (
      <div
        data-testid="campus-selector-error"
        className={`inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/10 px-2 py-1 text-xs text-danger ${className}`}
      >
        <AlertCircle className="h-3 w-3" />
        <span className="text-[11px] truncate max-w-[120px]">
          {error?.message || 'Error'}
        </span>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded p-0.5 hover:bg-danger/20 transition-colors"
          title="Retry loading campuses"
          aria-label="Retry loading campuses"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>
    );
  }

  // 3. Single-Campus Non-Interactive Display (No Misleading Switcher)
  if (isSingleCampus) {
    return (
      <div
        data-testid="campus-selector-single"
        className={`inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface-muted/60 px-2 py-0.5 text-xs text-foreground ${className}`}
        title={`Assigned Campus: ${activeCampus?.name || 'Main Campus'}`}
      >
        <MapPin className="h-3 w-3 text-primary shrink-0" />
        <span className="truncate max-w-[140px] font-medium text-foreground">
          {activeCampus?.name || 'Main Campus'}
        </span>
        {activeCampus?.code && (
          <span className="font-mono text-[10px] text-muted-foreground">
            ({activeCampus.code})
          </span>
        )}
      </div>
    );
  }

  // 4. Multi-Campus Interactive Selector
  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select Campus Context"
        disabled={isSwitching}
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface-muted/60 px-2.5 py-1 text-xs font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 ${
          isOpen ? 'border-primary ring-2 ring-primary/20 bg-surface' : ''
        } ${isSwitching ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
      >
        {isSwitching ? (
          <Loader2 className="h-3 w-3 animate-spin text-primary shrink-0" />
        ) : (
          <MapPin className="h-3 w-3 text-primary shrink-0 group-hover:scale-110 transition-transform" />
        )}

        <span className="truncate max-w-[130px] sm:max-w-[160px] text-left">
          {activeCampus?.name || 'Select Campus'}
        </span>

        {activeCampus?.code && (
          <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
            ({activeCampus.code})
          </span>
        )}

        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Authorized Campuses"
          className="absolute left-0 z-50 mt-1.5 w-64 divide-y divide-border rounded-xl border border-border bg-surface p-1 shadow-xl animate-in fade-in-0 zoom-in-95"
        >
          <div className="px-2 py-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Authorized Campuses ({campuses.length})
              </span>
              {activeCampus?.isMainCampus && (
                <Badge variant="primary" className="text-[9px] px-1.5 py-0">
                  Main Active
                </Badge>
              )}
            </div>
          </div>

          <div className="py-1 max-h-60 overflow-y-auto space-y-0.5">
            {campuses.map((campus, index) => {
              const isActive = campus.id === activeLocationId;
              const isTargetSwitching = isSwitching && !isActive;

              return (
                <button
                  key={campus.id}
                  ref={(el) => {
                    optionsRef.current[index] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  disabled={isSwitching}
                  onClick={() => handleSelectCampus(campus.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors text-left ${
                    isActive
                      ? 'bg-primary/10 font-bold text-primary'
                      : highlightedIndex === index
                      ? 'bg-surface-muted text-foreground'
                      : 'text-foreground/80 hover:bg-surface-muted hover:text-foreground'
                  } ${isSwitching ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate">{campus.name}</span>
                      {campus.isMainCampus && (
                        <span className="rounded bg-primary/10 px-1 py-0.2 text-[9px] font-semibold text-primary">
                          Main
                        </span>
                      )}
                    </div>
                    {campus.code && (
                      <span className="font-mono text-[10px] text-muted-foreground">
                        Code: {campus.code}
                      </span>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isActive ? (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    ) : isTargetSwitching ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

