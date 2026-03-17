import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';
import type { ChunkingConfig } from '../types';

export function useChunkingConfig() {
  const [config, setConfig] = useState<ChunkingConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getChunkingConfig();
      setConfig(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '설정을 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (maxTokens: number, overlapTokens: number) => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await api.updateChunkingConfig({ maxTokens, overlapTokens });
      setConfig(res.data);
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : '설정 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, []);

  const clearSuccess = useCallback(() => setSuccess(false), []);

  return { config, isLoading, isSaving, error, success, fetchConfig, updateConfig, clearSuccess } as const;
}
