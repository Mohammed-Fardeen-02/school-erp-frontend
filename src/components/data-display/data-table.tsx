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
} from 'lucide-react';
import { ActionMenu, type CustomAction } from '@/components/ui/action-menu';
import { Checkbox } from '@/components/forms/checkbox';
import { cn } from '@/lib/utils';

export interface DataTableColumn<T = Record<string, unknown>> {
  id?: string;
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
  visible?: boolean;
}

export interface DataTableProps<T = Record<string, unknown>> {
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
  searchPlaceholder?: string;
  actionConfig?: {
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    canDelete?: (row: T) => boolean;
    customActions?: (row: T) => CustomAction[];
  };
}

export function DataTable<T extends Record<string, unknown> = Record<string, unknown>>({
  columns: initialColumns,
  data,
  selectable = true,
  selectedIds: externalSelectedIds,
  onSelectionChange,
  onRowClick,
  rowIdKey = 'id' as keyof T,
  pageSizeOptions = [10, 20, 50, 100],
  resultLabel = 'results',
  maxHeight = '560px',
  toolbarLeft,
  toolbarRight,
  searchPlaceholder = 'Search...',
  actionConfig,
  loading = false,
}: DataTableProps<T>) {
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(new Set());
  const selectedIds = externalSelectedIds ?? internalSelectedIds;

  const handleSelectionChange = (ids: Set<string>) => {
    if (onSelectionChange) {
      onSelectionChange(ids);
    } else {
      setInternalSelectedIds(ids);
    }
  };

  const [columns, setColumns] = useState<DataTableColumn<T>[]>(initialColumns);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0] || 10);
  const [showColSettings, setShowColSettings] = useState(false);
  const colSettingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  // Click outside listener for column visibility settings
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colSettingsRef.current && !colSettingsRef.current.contains(event.target as Node)) {
        setShowColSettings(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visibleColumns = useMemo(() => columns.filter(col => col.visible !== false), [columns]);

  // Search filtering
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const lower = search.toLowerCase();
    return data.filter(row =>
      columns.some(col => {
        const val = row[col.key];
        return val != null && String(val).toLowerCase().includes(lower);
      })
    );
  }, [data, search, columns]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = aVal < bVal ? -1 : 1;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else {
        setSortKey(null);
        setSortDir('asc');
      }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(pagedData.map(r => String(r[rowIdKey])));
      handleSelectionChange(allIds);
    } else {
      handleSelectionChange(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    handleSelectionChange(next);
  };

  const isAllSelected =
    pagedData.length > 0 && pagedData.every(r => selectedIds.has(String(r[rowIdKey])));
  const isSomeSelected =
    pagedData.some(r => selectedIds.has(String(r[rowIdKey]))) && !isAllSelected;

  const toggleColumnVisibility = (key: string) => {
    setColumns(prev =>
      prev.map(col => (col.key === key ? { ...col, visible: col.visible === false } : col))
    );
  };

  const hasActions = !!actionConfig;

  return (
    <div className="flex flex-col bg-surface border border-border rounded-xl shadow-sm overflow-hidden w-full">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border bg-surface">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          {/* Search bar */}
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-8 h-9 text-sm bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {toolbarLeft}
        </div>

        <div className="flex items-center gap-2">
          {toolbarRight}

          {/* Column Visibility Settings */}
          <div className="relative" ref={colSettingsRef}>
            <button
              type="button"
              onClick={() => setShowColSettings(prev => !prev)}
              className="p-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
              title="Column Display Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            {showColSettings && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-surface border border-border rounded-xl shadow-xl z-50 p-2 text-xs">
                <div className="font-semibold text-foreground px-2 py-1 mb-1 border-b border-border">
                  Toggle Columns
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {columns.map(col => (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => toggleColumnVisibility(col.key)}
                      className="flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-left text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
                    >
                      <span className="truncate">{col.label}</span>
                      {col.visible !== false && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="relative overflow-x-auto" style={{ maxHeight }}>
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface/70 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border shadow-md text-sm font-medium text-foreground">
              <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Loading records...
            </div>
          </div>
        )}

        <table className="w-full text-left text-sm text-foreground border-collapse">
          <thead className="bg-surface-muted text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 z-10 border-b border-border">
            <tr>
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    checked={isAllSelected ? true : isSomeSelected ? 'indeterminate' : false}
                    onCheckedChange={checked => handleSelectAll(checked === true)}
                  />
                </th>
              )}

              {visibleColumns.map(col => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={cn(
                    'px-4 py-3 whitespace-nowrap select-none',
                    col.sortable !== false ? 'cursor-pointer hover:text-foreground' : '',
                    col.align === 'center'
                      ? 'text-center'
                      : col.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                  )}
                >
                  <div className="inline-flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {col.sortable !== false && (
                      <span className="text-muted-foreground">
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-primary" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}

              {hasActions && (
                <th className="w-14 px-4 py-3 text-center whitespace-nowrap">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-surface">
            {pagedData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)}
                  className="py-12 text-center"
                >
                  <EmptyStateIllustration className="w-48 h-auto mx-auto mb-3 opacity-80" />
                  <p className="text-sm font-medium text-foreground">No records found</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {search
                      ? 'Try modifying your search query'
                      : 'No entries available at this time'}
                  </p>
                </td>
              </tr>
            ) : (
              pagedData.map(row => {
                const id = String(row[rowIdKey]);
                const isSelected = selectedIds.has(id);

                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={cn(
                      'transition-colors hover:bg-surface-muted/50',
                      isSelected ? 'bg-primary/5' : '',
                      onRowClick ? 'cursor-pointer' : ''
                    )}
                  >
                    {selectable && (
                      <td className="w-10 px-4 py-3" onClick={e => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={checked => handleSelectRow(id, checked === true)}
                        />
                      </td>
                    )}

                    {visibleColumns.map(col => (
                      <td
                        key={col.key}
                        className={cn(
                          'px-4 py-3 text-sm text-foreground whitespace-nowrap',
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                              ? 'text-right'
                              : 'text-left'
                        )}
                      >
                        {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                      </td>
                    ))}

                    {hasActions && (
                      <td className="w-14 px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                        <ActionMenu
                          onView={actionConfig.onView ? () => actionConfig.onView!(row) : undefined}
                          onEdit={actionConfig.onEdit ? () => actionConfig.onEdit!(row) : undefined}
                          onDelete={
                            actionConfig.onDelete &&
                            (actionConfig.canDelete ? actionConfig.canDelete(row) : true)
                              ? () => actionConfig.onDelete!(row)
                              : undefined
                          }
                          customActions={
                            actionConfig.customActions ? actionConfig.customActions(row) : undefined
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

      {/* Bottom Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 border-t border-border bg-surface text-xs text-muted-foreground">
        <div>
          Showing{' '}
          <span className="font-semibold text-foreground">
            {sortedData.length > 0 ? (page - 1) * pageSize + 1 : 0}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-foreground">
            {Math.min(page * pageSize, sortedData.length)}
          </span>{' '}
          of <span className="font-semibold text-foreground">{sortedData.length}</span>{' '}
          {resultLabel}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="h-7 rounded border border-border bg-surface px-1.5 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {pageSizeOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page <= 1}
              className="p-1.5 rounded border border-border bg-surface text-foreground hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-medium text-foreground">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page >= totalPages}
              className="p-1.5 rounded border border-border bg-surface text-foreground hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
