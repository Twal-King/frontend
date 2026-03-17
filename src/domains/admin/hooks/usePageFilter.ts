import { useState, useCallback, useMemo } from 'react';
import type { EmbeddingStatus, NotionPage, PageFilter } from '../types';

export function usePageFilter(pages: NotionPage[]) {
  const [filter, setFilter] = useState<PageFilter>({ status: 'all', search: '' });

  const setStatus = useCallback((status: EmbeddingStatus | 'all') => {
    setFilter((prev) => ({ ...prev, status }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilter((prev) => ({ ...prev, search }));
  }, []);

  const resetFilter = useCallback(() => {
    setFilter({ status: 'all', search: '' });
  }, []);

  const filteredPages = useMemo(() => {
    let result = pages;

    if (filter.status !== 'all') {
      result = result.filter((p) => p.embeddingStatus === filter.status);
    }

    if (filter.search.trim()) {
      const query = filter.search.trim().toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(query));
    }

    return result;
  }, [pages, filter]);

  return {
    filter,
    filteredPages,
    setStatus,
    setSearch,
    resetFilter,
  } as const;
}
