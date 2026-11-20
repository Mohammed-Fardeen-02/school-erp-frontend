import React from 'react';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded-lg bg-surface-muted/80 ${className}`.trim()}
      aria-hidden="true"
    />
  );
};

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className = '',
}) => {
  return (
    <div
      data-testid="table-skeleton"
      className={`rounded-2xl border border-border bg-surface p-4 space-y-3 ${className}`.trim()}
    >
      {/* Table Header Skeleton */}
      <div className="flex gap-4 pb-3 border-b border-border">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Table Rows Skeleton */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-2 border-b border-border/50 last:border-b-0">
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={c} className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export interface CardSkeletonProps {
  count?: number;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ count = 4, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`.trim()}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          data-testid="card-skeleton"
          className="rounded-2xl border border-border bg-surface p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-xl" />
          </div>
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
};

export const LoadingSkeleton = {
  Base: Skeleton,
  Table: TableSkeleton,
  Cards: CardSkeleton,
};

