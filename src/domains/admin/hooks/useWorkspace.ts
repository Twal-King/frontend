import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';
import type { WorkspacePage } from '../types';

export function useWorkspace() {
  const [pages, setPages] = useState<WorkspacePage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncResults, setSyncResults] = useState<Array<{ notionPageId: string; success: boolean; error?: string }>>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchWorkspacePages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getWorkspacePages();
      setPages(res.data.pages);
    } catch (e) {
      setError(e instanceof Error ? e.message : '워크스페이스 페이지를 불러올 수 없습니다.');
      setPages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const syncPages = useCallback(async (pageIds: string[]) => {
    if (pageIds.length === 0) return;
    setIsSyncing(true);
    setSyncResults([]);
    try {
      const res = await api.syncWorkspacePages(pageIds);
      setSyncResults(res.data.results);
    } catch (e) {
      setError(e instanceof Error ? e.message : '동기화에 실패했습니다.');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const importPage = useCallback(async (notionPageId: string) => {
    try {
      const res = await api.importNotionPage(notionPageId);
      return res.data;
    } catch (e) {
      setError(e instanceof Error ? e.message : '페이지 임포트에 실패했습니다.');
      return null;
    }
  }, []);

  const clearSyncResults = useCallback(() => setSyncResults([]), []);

  return {
    pages, isLoading, error, syncResults, isSyncing,
    fetchWorkspacePages, syncPages, importPage, clearSyncResults,
  } as const;
}
