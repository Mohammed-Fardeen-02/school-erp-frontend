import { useState } from 'react';

export type ViewMode = 'list' | 'grid';

export function useSearch(initialValue = '') {
  const [query, setQuery] = useState(initialValue);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const filter = <T extends Record<string, unknown>>(items: T[], keys: (keyof T)[]): T[] => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(item =>
      keys.some(k =>
        String(item[k] ?? '')
          .toLowerCase()
          .includes(q)
      )
    );
  };

  return { query, setQuery, viewMode, setViewMode, filter };
}
