import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';
import type { DocumentStatus, EmbeddingStatus, NotionPage } from '../types';
import { toNotionPage, toDocumentStatus } from '../types';

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
        const backendStatus: DocumentStatus | undefined =
          params?.status ? toDocumentStatus(params.status) : undefined;

        const res = await api.getNotionPages({
          status: backendStatus,
          page: targetPage,
          limit: pageSize,
        });

        let notionPages = res.data.documents.map(toNotionPage);

        // 클라이언트 사이드 텍스트 검색 (백엔드에 검색 파라미터 없음)
        if (params?.search?.trim()) {
          const query = params.search.trim().toLowerCase();
          notionPages = notionPages.filter((p) =>
            p.title.toLowerCase().includes(query),
          );
        }

        setPages(notionPages);
        setTotal(res.meta.total);
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

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

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
