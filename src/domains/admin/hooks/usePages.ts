import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';
import type { EmbeddingStatus, NotionPage } from '../types';

interface UsePagesOptions {
  pageSize?: number;
}

export function usePages({ pageSize = 20 }: UsePagesOptions = {}) {
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = useCallback(
    async (params?: { status?: EmbeddingStatus; search?: string; page?: number }) => {
      const targetPage = params?.page ?? page;
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.getPages({
          status: params?.status,
          search: params?.search,
          page: targetPage,
          pageSize,
        });
        setPages(res.pages);
        setTotal(res.total);
        setPage(targetPage);
      } catch (e) {
        const msg = e instanceof Error ? e.message : '페이지 목록을 불러올 수 없습니다.';
        setError(msg);
        setPages([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize],
  );

  const goToPage = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [],
  );

  const updatePageStatus = useCallback(
    (pageId: string, status: EmbeddingStatus) => {
      setPages((prev) =>
        prev.map((p) => (p.id === pageId ? { ...p, embeddingStatus: status } : p)),
      );
    },
    [],
  );

  const totalPages = Math.ceil(total / pageSize);

  return {
    pages,
    total,
    page,
    pageSize,
    totalPages,
    isLoading,
    error,
    fetchPages,
    goToPage,
    updatePageStatus,
  } as const;
}
