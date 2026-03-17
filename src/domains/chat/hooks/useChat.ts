import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';
import type { Message } from '../types';

export function useChat(activeSessionId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (query: string) => {
      if (!activeSessionId || !query.trim()) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        sessionId: activeSessionId,
        role: 'user',
        content: query.trim(),
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const res = await api.search({
          sessionId: activeSessionId,
          query: query.trim(),
        });
        setMessages((prev) => [...prev, res.message]);
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [activeSessionId],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const retry = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      // Remove the failed attempt's user message and resend
      setMessages((prev) => prev.filter((m) => m.id !== lastUserMsg.id));
      sendMessage(lastUserMsg.content);
    }
  }, [messages, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    setMessages,
    retry,
  } as const;
}
