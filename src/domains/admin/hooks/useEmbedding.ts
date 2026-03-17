import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';
import type { EmbeddingStatus, NotionPage } from '../types';
import { toEmbeddingStatus } from '../types';

interface BulkProgress {
  isRunning: boolean;
  completed: number;
  total: number;
}

export function useEmbedding(
  onStatusUpdate?: (pageId: string, status: EmbeddingStatus) => void,
  getPages?: () => NotionPage[],
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bulkProgress, setBulkProgress] = useState<BulkProgress | null>(null);

  // documentId를 찾기 위한 헬퍼
  const findDocumentId = useCallback(
    (pageId: string): string | undefined => {
      const pages = getPages?.() ?? [];
      return pages.find((p) => p.id === pageId)?.documentId;
    },
    [getPages],
  );

  const requestEmbedding = useCallback(
    async (pageIds: string[]) => {
      if (pageIds.length === 0) return;

      setIsLoading(true);
      setError(null);

      pageIds.forEach((id) => onStatusUpdate?.(id, 'processing'));

      try {
        for (const pageId of pageIds) {
          const documentId = findDocumentId(pageId) ?? pageId;
          try {
            const res = await api.runPipeline(documentId);
            onStatusUpdate?.(pageId, toEmbeddingStatus(res.data.status));
          } catch {
            // 이미 처리 중이면 retry 시도
            try {
              const res = await api.retryPipeline(documentId);
              onStatusUpdate?.(pageId, toEmbeddingStatus(res.data.status));
            } catch {
              onStatusUpdate?.(pageId, 'failed');
            }
          }
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : '임베딩 요청에 실패했습니다.';
        setError(msg);
        pageIds.forEach((id) => onStatusUpdate?.(id, 'failed'));
      } finally {
        setIsLoading(false);
      }
    },
    [onStatusUpdate, findDocumentId],
  );

  const requestBulkEmbedding = useCallback(
    async (pageIds: string[]) => {
      if (pageIds.length === 0) return;

      setBulkProgress({ isRunning: true, completed: 0, total: pageIds.length });
      setError(null);

      pageIds.forEach((id) => onStatusUpdate?.(id, 'processing'));

      let completed = 0;
      for (const pageId of pageIds) {
        const documentId = findDocumentId(pageId) ?? pageId;
        try {
          const res = await api.runPipeline(documentId);
          onStatusUpdate?.(pageId, toEmbeddingStatus(res.data.status));
        } catch {
          try {
            const res = await api.retryPipeline(documentId);
            onStatusUpdate?.(pageId, toEmbeddingStatus(res.data.status));
          } catch {
            onStatusUpdate?.(pageId, 'failed');
          }
        }
        completed++;
        setBulkProgress({ isRunning: true, completed, total: pageIds.length });
      }

      setBulkProgress((prev) =>
        prev ? { ...prev, isRunning: false } : null,
      );
    },
    [onStatusUpdate, findDocumentId],
  );

  return {
    isLoading,
    error,
    bulkProgress,
    requestEmbedding,
    requestBulkEmbedding,
  } as const;
}
