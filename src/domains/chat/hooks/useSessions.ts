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

  const createSession = useCallback(async () => {
    const now = new Date().toISOString();
    const optimisticSession: Session = {
      id: crypto.randomUUID(),
      title: '새 대화',
      createdAt: now,
      updatedAt: now,
    };

    // Optimistic update
    setSessions((prev) => [optimisticSession, ...prev]);
    setActiveSessionId(optimisticSession.id);

    try {
      const res = await api.createSession('새 대화');
      const serverSession = res.data.session;
      // Replace optimistic session with server session
      setSessions((prev) =>
        prev.map((s) => (s.id === optimisticSession.id ? serverSession : s)),
      );
      setActiveSessionId(serverSession.id);
      return serverSession;
    } catch {
      // Keep optimistic session on failure (works offline)
      return optimisticSession;
    }
  }, []);

  const deleteSession = useCallback(
    async (sessionId: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
      }
      try {
        await api.deleteSession(sessionId);
      } catch {
        // Refetch to restore if delete failed
        fetchSessions();
      }
    },
    [activeSessionId, fetchSessions],
  );

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
    deleteSession,
  } as const;
}
