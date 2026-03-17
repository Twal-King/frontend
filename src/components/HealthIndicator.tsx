import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { cn } from '../utils/cn';

export function HealthIndicator() {
  const [status, setStatus] = useState<'ok' | 'error' | 'loading'>('loading');

  const check = useCallback(async () => {
    try {
      const res = await api.health();
      setStatus(res.data.status === 'ok' ? 'ok' : 'error');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [check]);

  return (
    <div className="flex items-center gap-2 px-4 py-3 text-xs">
      <span
        className={cn(
          'w-2 h-2 rounded-full',
          status === 'ok' && 'bg-success',
          status === 'error' && 'bg-error',
          status === 'loading' && 'bg-secondary animate-pulse',
        )}
      />
      <span className="text-secondary">
        {status === 'ok' && '서버 연결됨'}
        {status === 'error' && '서버 연결 실패'}
        {status === 'loading' && '확인 중...'}
      </span>
    </div>
  );
}
