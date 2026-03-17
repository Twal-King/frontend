import { useState, useCallback, useEffect } from 'react';
import { api } from '../../../utils/api';
import type { Session } from '../types';

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getSessions();
      setSessions(res.sessions);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : '세션 목록을 불러올 수 없습니다.';
      setError(msg);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSession = useCallback(() => {
    const now = new Date().toISOString();
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: '새 대화',
      createdAt: now,
      updatedAt: now,
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    return newSession;
  }, []);

  const switchSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    activeSessionId,
    isLoading,
    error,
    fetchSessions,
    createSession,
    switchSession,
  } as const;
}
