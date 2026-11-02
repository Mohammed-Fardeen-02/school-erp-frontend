import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  Search,
  User as UserIcon,
  Check,
  X,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspaceMembers } from '../../hooks/use-assignments';
import type { WorkspaceMemberSummary } from '../../types/assignments.types';

export interface MemberSearchSelectorProps {
  selectedMember: WorkspaceMemberSummary | null;
  onSelectMember: (member: WorkspaceMemberSummary | null) => void;
  disabled?: boolean;
  className?: string;
}

export const MemberSearchSelector: React.FC<MemberSearchSelectorProps> = ({
  selectedMember,
  onSelectMember,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useWorkspaceMembers(
    {
      search: debouncedSearch,
      page,
      limit: 10,
    },
    { enabled: isOpen || !selectedMember }
  );

  const members = data?.members || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 0 };

  const handleSelect = (member: WorkspaceMemberSummary) => {
    onSelectMember(member);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectMember(null);
    setSearchTerm('');
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className={cn('relative w-full', className)} ref={dropdownRef}>
      {selectedMember ? (
        // Selected Member Card View
        <div
          data-testid="selected-member-card"
          className={cn(
            'flex items-center justify-between p-3 rounded-xl border border-primary/30 bg-primary/5 transition-all',
            disabled && 'opacity-60 pointer-events-none'
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">
              {selectedMember.firstName[0]?.toUpperCase()}
              {selectedMember.lastName[0]?.toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground truncate">
                  {selectedMember.firstName} {selectedMember.lastName}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 truncate">
                  <Mail className="w-3 h-3 text-muted-foreground/70" />
                  {selectedMember.email}
                </span>
                {selectedMember.phone && (
                  <span className="hidden sm:flex items-center gap-1 font-mono text-[11px]">
                    <Phone className="w-3 h-3 text-muted-foreground/70" />
                    {selectedMember.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!disabled && (
            <button
              type="button"
              data-testid="clear-selected-member"
              onClick={handleClear}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors cursor-pointer"
              title="Change member"
              aria-label="Change selected member"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        // Search Input Combobox
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              data-testid="member-search-input"
              value={searchTerm}
              disabled={disabled}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search active members by name, email, or phone..."
              className={cn(
                'w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground shadow-xs transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                disabled && 'opacity-60 cursor-not-allowed bg-surface-muted'
              )}
            />
            {isFetching ? (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
            ) : searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          {/* Results Dropdown */}
          {isOpen && (
            <div
              data-testid="member-search-dropdown"
              className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl border border-border bg-surface shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-98 duration-150"
            >
              {isLoading ? (
                <div className="flex items-center justify-center p-6 gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>Searching active members...</span>
                </div>
              ) : isError ? (
                <div
                  data-testid="member-search-error"
                  className="p-4 flex flex-col items-center justify-center text-center gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-danger" />
                  <p className="text-xs text-danger font-medium">
                    {error instanceof Error ? error.message : 'Failed to search members'}
                  </p>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline cursor-pointer mt-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry search
                  </button>
                </div>
              ) : members.length === 0 ? (
                <div data-testid="member-search-empty" className="p-6 text-center">
                  <UserIcon className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">No active members found</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {debouncedSearch
                      ? `No results matching "${debouncedSearch}" in this organization.`
                      : 'No active members available in this organization.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="max-h-60 overflow-y-auto divide-y divide-border/50">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        data-testid={`member-option-${member.id}`}
                        onClick={() => handleSelect(member)}
                        className="flex items-center justify-between p-3 hover:bg-surface-muted/60 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                            {member.firstName[0]?.toUpperCase()}
                            {member.lastName[0]?.toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-foreground truncate">
                              {member.firstName} {member.lastName}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span className="truncate">{member.email}</span>
                              {member.phone && (
                                <span className="font-mono text-muted-foreground/70 hidden sm:inline">
                                  • {member.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {selectedMember?.id === member.id && (
                          <Check className="w-4 h-4 text-primary shrink-0 ml-2" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Dropdown Footer with Pagination */}
                  <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-surface-muted/30 text-xs text-muted-foreground">
                    <span className="text-[11px]">
                      Showing {members.length} of {meta.total} members
                    </span>

                    {meta.totalPages > 1 && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          data-testid="member-pagination-prev"
                          disabled={page <= 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className="p-1 rounded hover:bg-surface disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-mono px-1">
                          {meta.page} / {meta.totalPages}
                        </span>
                        <button
                          type="button"
                          data-testid="member-pagination-next"
                          disabled={page >= meta.totalPages}
                          onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                          className="p-1 rounded hover:bg-surface disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          aria-label="Next page"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

