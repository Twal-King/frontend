import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';
import type { EmbeddingStatus } from '../types';

interface BulkProgress {
  isRunning: boolean;
  completed: number;
  total: number;
}

export function useEmbedding(
  onStatusUpdate?: (pageId: string, status: EmbeddingStatus) => void,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bulkProgress, setBulkProgress] = useState<BulkProgress | null>(null);

  const requestEmbedding = useCallback(
    async (pageIds: string[]) => {
      if (pageIds.length === 0) return;

      setIsLoading(true);
      setError(null);

      // Mark pages as processing
      pageIds.forEach((id) => onStatusUpdate?.(id, 'processing'));

      try {
        const results = await api.requestEmbedding({ pageIds });
        results.forEach((result) => {
          onStatusUpdate?.(result.pageId, result.status);
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : '임베딩 요청에 실패했습니다.';
        setError(msg);
        pageIds.forEach((id) => onStatusUpdate?.(id, 'failed'));
      } finally {
        setIsLoading(false);
      }
    },
    [onStatusUpdate],
  );

  const requestBulkEmbedding = useCallback(
    async (pageIds: string[]) => {
      if (pageIds.length === 0) return;

      setBulkProgress({ isRunning: true, completed: 0, total: pageIds.length });
      setError(null);

      // Mark all as processing
      pageIds.forEach((id) => onStatusUpdate?.(id, 'processing'));

      try {
        const results = await api.requestEmbedding({ pageIds });
        results.forEach((result, index) => {
          onStatusUpdate?.(result.pageId, result.status);
          setBulkProgress((prev) =>
            prev ? { ...prev, completed: index + 1 } : null,
          );
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : '일괄 임베딩 요청에 실패했습니다.';
        setError(msg);
        pageIds.forEach((id) => onStatusUpdate?.(id, 'failed'));
      } finally {
        setBulkProgress((prev) =>
          prev ? { ...prev, isRunning: false } : null,
        );
      }
    },
    [onStatusUpdate],
  );

  return {
    isLoading,
    error,
    bulkProgress,
    requestEmbedding,
    requestBulkEmbedding,
  } as const;
}
