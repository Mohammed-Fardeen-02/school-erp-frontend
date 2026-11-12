import { useState, useMemo, useRef, useEffect, type ReactNode } from 'react';
import { EmptyStateIllustration } from './empty-state-illustration';
import {
  Search,
  X,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Check,
  Filter,
} from 'lucide-react';
import { ActionMenu, type CustomAction } from '@/components/ui/action-menu';

export interface DataTableColumn<T = any> {
  id?: string;
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
  visible?: boolean;
}

export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  onRowClick?: (row: T) => void;
  rowIdKey?: keyof T;
  pageSizeOptions?: number[];
  resultLabel?: string;
  maxHeight?: string;
  toolbarRight?: ReactNode;
  toolbarLeft?: ReactNode;
  draggable?: boolean;
  onReorder?: (newData: T[]) => void;
  searchPlaceholder?: string;
  statusKey?: string;
  actionConfig?: {
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    canDelete?: (row: T) => boolean;
    customActions?: (row: T) => CustomAction[];
  };
}

export function DataTable<T extends Record<string, any> = any>({
  columns: initialColumns,
  data,
  selectable: _selectable = true,
  selectedIds: externalSelectedIds,
  onSelectionChange,
  onRowClick,
  rowIdKey = 'id' as keyof T,
  pageSizeOptions = [5, 10, 25, 50],
  resultLabel = 'results',
  maxHeight = '560px',
  toolbarLeft,
  toolbarRight,
  draggable = false,
  searchPlaceholder = 'Search...',
  statusKey = 'status',
  actionConfig,
  loading = false,
}: DataTableProps<T>) {
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(new Set());
  const selectedIds = externalSelectedIds ?? internalSelectedIds;

  const handleSelectionChange = (ids: Set<string>) => {
    setInternalSelectedIds(ids);
    onSelectionChange?.(ids);
  };

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0] ?? 10);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() =>
    initialColumns.reduce(
      (acc, col) => ({ ...acc, [col.key]: col.visible !== false }),
      {} as Record<string, boolean>
    )
  );

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setShowStatusMenu(false);
      }
      if (columnRef.current && !columnRef.current.contains(event.target as Node)) {
        setShowColumnMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showStatusMenu) setShowColumnMenu(false);
  }, [showStatusMenu]);

  useEffect(() => {
    if (showColumnMenu) setShowStatusMenu(false);
  }, [showColumnMenu]);

  const columns = useMemo(
    () => initialColumns.filter(col => visibleColumns[col.key] !== false),
    [initialColumns, visibleColumns]
  );

  const statusOptions = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(row => {
      const val = row[statusKey];
      const status = String(val !== undefined && val !== null ? val : 'Unknown').trim();
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => a.status.localeCompare(b.status));
  }, [data, statusKey]);

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredData = useMemo(() => {
    let result = [...data];
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(row =>
        columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(q))
      );
    }
    if (selectedStatuses.length > 0) {
      result = result.filter(row => selectedStatuses.includes(String(row[statusKey])));
    }
    return result;
  }, [data, search, columns, selectedStatuses, statusKey]);

  const sorted = useMemo(() => {
    if (!sortCol) return filteredData;
    return [...filteredData].sort((a, b) => {
      const av = a[sortCol];
      const bv = b[sortCol];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filteredData, sortCol, sortDir]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const paged = useMemo(
    () => sorted.slice((page - 1) * pageSize, page * pageSize),
    [sorted, page, pageSize]
  );

  const resetPage = () => setPage(1);
  const handleSearch = (v: string) => {
    setSearch(v);
    resetPage();
  };
  const handlePageSize = (s: number) => {
    setPageSize(s);
    resetPage();
  };

  const handleSort = (key: string) => {
    if (sortCol === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(key);
      setSortDir('asc');
    }
    resetPage();
  };

  const colSpan = columns.length + 1 + (actionConfig ? 1 : 0) + (draggable ? 1 : 0);

  const pagedIds = paged.map(row => String(row[rowIdKey]));
  const allPageSelected = pagedIds.length > 0 && pagedIds.every(id => selectedIds.has(id));
  const somePageSelected = pagedIds.some(id => selectedIds.has(id));

  const toggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (allPageSelected) {
      pagedIds.forEach(id => next.delete(id));
    } else {
      pagedIds.forEach(id => next.add(id));
    }
    handleSelectionChange(next);
  };

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    handleSelectionChange(next);
  };

  // Generate page numbers for pagination
  const paginationRange = useMemo(() => {
    const maxButtons = 7;
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let startPage = Math.max(1, page - 3);
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [totalPages, page]);

  return (
    <div className="bg-surface rounded-xl border border-border shadow-xs overflow-hidden w-full">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-6 py-3 border-b border-border bg-surface">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
          {toolbarLeft}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-9 h-9 text-sm bg-surface border border-border text-foreground placeholder:text-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-start md:justify-end w-full md:w-auto py-1">
          {toolbarRight}

          {/* Status Filter Dropdown */}
          <div className="relative" ref={statusRef}>
            <button
              type="button"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border border-border text-foreground rounded-lg hover:bg-surface-muted hover:border-primary/30 transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Status</span>
              {selectedStatuses.length > 0 && (
                <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] font-bold text-primary">
                  {selectedStatuses.length}
                </span>
              )}
            </button>

            {showStatusMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl border border-border shadow-xl z-50 py-2 max-h-[320px] overflow-auto text-xs animate-in fade-in-0 zoom-in-95">
                <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                  STATUS FILTER
                </div>
                <label className="flex items-center gap-3 px-4 py-2 hover:bg-primary/5 cursor-pointer text-foreground font-medium">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.length === 0}
                    onChange={() => {
                      setSelectedStatuses([]);
                      resetPage();
                    }}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                  <span>All Statuses</span>
                  <span className="ml-auto text-muted-foreground text-xs">({data.length})</span>
                </label>
                {statusOptions.map(({ status, count }) => (
                  <label
                    key={status}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-primary/5 cursor-pointer text-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => {
                        const next = selectedStatuses.includes(status)
                          ? selectedStatuses.filter(s => s !== status)
                          : [...selectedStatuses, status];
                        setSelectedStatuses(next);
                        resetPage();
                      }}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                    <span className="capitalize">{status.replace(/_/g, ' ').toLowerCase()}</span>
                    <span className="ml-auto text-muted-foreground text-xs">({count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Columns Visibility Menu */}
          <div className="relative" ref={columnRef}>
            <button
              type="button"
              onClick={() => setShowColumnMenu(!showColumnMenu)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border border-border text-foreground rounded-lg hover:bg-surface-muted hover:border-primary/30 transition-colors cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Columns</span>
            </button>
            {showColumnMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-surface rounded-xl border border-border shadow-xl z-50 py-2 max-h-[300px] overflow-auto text-xs animate-in fade-in-0 zoom-in-95">
                <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                  SHOW COLUMNS
                </div>
                {initialColumns.map(col => (
                  <label
                    key={col.key}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-primary/5 cursor-pointer text-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns[col.key] !== false}
                      onChange={() => toggleColumn(col.key)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                    <span className="truncate">{col.label}</span>
                    {visibleColumns[col.key] !== false && (
                      <Check className="w-4 h-4 text-primary ml-auto shrink-0" />
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Table Body */}
      <div className="overflow-x-auto">
        <div className="overflow-auto" style={{ maxHeight }}>
          <table className="w-full border-collapse border border-border">
            <thead className="sticky top-0 z-20">
              <tr style={{ backgroundColor: 'var(--color-table-header-bg, #ede9fe)', borderBottom: '2px solid var(--color-table-header-border, #c4b5fd)' }}>
                {draggable && (
                  <th
                    className="w-10 px-4 py-3"
                    style={{ backgroundColor: 'var(--color-table-header-bg, #ede9fe)', borderRight: '1px solid var(--color-table-header-border, #c4b5fd)', borderBottom: '2px solid var(--color-table-header-border, #c4b5fd)' }}
                  />
                )}
                <th
                  className="w-12 px-4 py-3 text-center"
                  style={{ backgroundColor: 'var(--color-table-header-bg, #ede9fe)', borderRight: '1px solid var(--color-table-header-border, #c4b5fd)', borderBottom: '2px solid var(--color-table-header-border, #c4b5fd)' }}
                >
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    ref={el => {
                      if (el) el.indeterminate = somePageSelected && !allPageSelected;
                    }}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-primary cursor-pointer"
                    title="Select all on this page"
                  />
                </th>
                {columns.map(col => {
                  const align = col.align || 'center';
                  const colKey = col.id || col.key;
                  return (
                    <th
                      key={colKey}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`px-4 py-3 text-xs font-bold uppercase tracking-wider ${
                        col.sortable ? 'cursor-pointer select-none hover:opacity-85' : ''
                      }`}
                      style={{
                        backgroundColor: 'var(--color-table-header-bg, #ede9fe)',
                        color: 'var(--color-table-header-text, #4c1d95)',
                        borderRight: '1px solid var(--color-table-header-border, #c4b5fd)',
                        borderBottom: '2px solid var(--color-table-header-border, #c4b5fd)',
                      }}
                    >
                      <div
                        className={`flex items-center gap-1.5 ${
                          align === 'center'
                            ? 'justify-center'
                            : align === 'right'
                              ? 'justify-end'
                              : 'justify-start'
                        }`}
                      >
                        <span>{col.label}</span>
                        {col.sortable &&
                          (sortCol === col.key ? (
                            sortDir === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-primary" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 text-primary/70" />
                          ))}
                      </div>
                    </th>
                  );
                })}
                {actionConfig && (
                  <th
                    className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider w-36"
                    style={{
                      backgroundColor: 'var(--color-table-header-bg, #ede9fe)',
                      color: 'var(--color-table-header-text, #4c1d95)',
                      borderBottom: '2px solid var(--color-table-header-border, #c4b5fd)',
                    }}
                  >
                    ACTION
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-surface">
              {loading ? (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-14 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                      <svg
                        className="animate-spin h-5 w-5 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <EmptyStateIllustration className="w-full max-w-xs h-auto opacity-80 mb-2" />
                      <p className="text-sm font-semibold text-foreground">No records found</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {search || selectedStatuses.length > 0
                          ? 'Try adjusting your search query or status filters'
                          : 'No data entries available at this time'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map(row => {
                  const id = String(row[rowIdKey]);
                  return (
                    <tr
                      key={id}
                      onClick={() => onRowClick?.(row)}
                      className={`transition-colors hover:bg-primary/5 ${
                        onRowClick ? 'cursor-pointer' : ''
                      }`}
                      style={{ borderBottom: '1px solid var(--color-table-grid, #e5e7eb)' }}
                    >
                      {draggable && (
                        <td
                          className="px-4 py-3 text-center text-muted-foreground"
                          style={{ borderRight: '1px solid var(--color-table-grid, #e5e7eb)', borderBottom: '1px solid var(--color-table-grid, #e5e7eb)' }}
                        >
                          ⋮⋮
                        </td>
                      )}
                      <td
                        className="px-4 py-3 text-center"
                        style={{ borderRight: '1px solid var(--color-table-grid, #e5e7eb)', borderBottom: '1px solid var(--color-table-grid, #e5e7eb)' }}
                        onClick={e => toggleRow(id, e)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.has(id)}
                          onChange={() => {}}
                          className="w-4 h-4 accent-primary cursor-pointer"
                        />
                      </td>
                      {columns.map(col => {
                        const align = col.align || 'center';
                        const colKey = col.id || col.key;
                        return (
                          <td
                            key={colKey}
                            className={`px-4 py-3 text-xs text-foreground ${
                              align === 'center'
                                ? 'text-center'
                                : align === 'right'
                                  ? 'text-right'
                                  : 'text-left'
                            }`}
                            style={{ borderRight: '1px solid var(--color-table-grid, #e5e7eb)', borderBottom: '1px solid var(--color-table-grid, #e5e7eb)' }}
                          >
                            {col.render
                              ? col.render(row[col.key], row)
                              : String(row[col.key] ?? '—')}
                          </td>
                        );
                      })}
                      {actionConfig && (
                        <td
                          className="px-4 py-3 text-center w-36"
                          style={{ borderBottom: '1px solid var(--color-table-grid, #e5e7eb)' }}
                          onClick={e => e.stopPropagation()}
                        >
                          <ActionMenu
                            onView={
                              actionConfig.onView ? () => actionConfig.onView!(row) : undefined
                            }
                            onEdit={
                              actionConfig.onEdit ? () => actionConfig.onEdit!(row) : undefined
                            }
                            onDelete={
                              actionConfig.onDelete &&
                              (actionConfig.canDelete ? actionConfig.canDelete(row) : true)
                                ? () => actionConfig.onDelete!(row)
                                : undefined
                            }
                            customActions={
                              actionConfig.customActions
                                ? actionConfig.customActions(row)
                                : undefined
                            }
                          />
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-3.5 border-t border-border bg-surface text-xs text-muted-foreground">
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between sm:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={e => handlePageSize(Number(e.target.value))}
              className="border border-border bg-surface text-foreground rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
            >
              {pageSizeOptions.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <span>
            Showing <strong className="font-semibold text-foreground">{start}</strong> -{' '}
            <strong className="font-semibold text-foreground">{end}</strong> of{' '}
            <strong className="font-semibold text-foreground">{total}</strong> {resultLabel}
          </span>
        </div>

        <div className="flex items-center justify-center gap-1 w-full sm:w-auto overflow-x-auto py-1">
          <button
            type="button"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {paginationRange.map(p => (
            <button
              type="button"
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg border text-xs font-semibold flex-shrink-0 transition-all ${
                p === page
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'border-border text-foreground hover:bg-primary/5'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
