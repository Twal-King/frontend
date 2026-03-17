import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';

interface GuideData {
  supportedFormats: Array<{ mimeType: string; extension: string; description: string }>;
  maxFileSizeMb: number;
  recommendedStructure: string[];
  optimizationTips: string[];
  antiPatterns: string[];
}

export function useGuide() {
  const [guide, setGuide] = useState<GuideData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuide = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getGuide();
      setGuide(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '가이드를 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { guide, isLoading, error, fetchGuide } as const;
}
