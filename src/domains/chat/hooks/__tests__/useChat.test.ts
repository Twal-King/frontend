import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChat } from '../useChat';

vi.mock('../../../../utils/api', () => ({
  api: {
    search: vi.fn(),
  },
}));

import { api } from '../../../../utils/api';

const mockedSearch = vi.mocked(api.search);

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('crypto', {
    randomUUID: () => 'test-uuid',
  });
});

describe('useChat', () => {
  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useChat('session-1'));
    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should not send message when activeSessionId is null', async () => {
    const { result } = renderHook(() => useChat(null));
    await act(async () => {
      await result.current.sendMessage('hello');
    });
    expect(result.current.messages).toEqual([]);
    expect(mockedSearch).not.toHaveBeenCalled();
  });

  it('should not send empty or whitespace-only messages', async () => {
    const { result } = renderHook(() => useChat('session-1'));
    await act(async () => {
      await result.current.sendMessage('   ');
    });
    expect(result.current.messages).toEqual([]);
    expect(mockedSearch).not.toHaveBeenCalled();
  });

  it('should add user message and AI response on successful send', async () => {
    const aiMessage = {
      id: 'ai-1',
      sessionId: 'session-1',
      role: 'assistant' as const,
      content: 'AI response',
      createdAt: '2024-01-01T00:00:01Z',
    };
    mockedSearch.mockResolvedValueOnce({ message: aiMessage });

    const { result } = renderHook(() => useChat('session-1'));
    await act(async () => {
      await result.current.sendMessage('hello');
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.messages[0].content).toBe('hello');
    expect(result.current.messages[1]).toEqual(aiMessage);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set error on API failure', async () => {
    mockedSearch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useChat('session-1'));
    await act(async () => {
      await result.current.sendMessage('hello');
    });

    expect(result.current.messages).toHaveLength(1); // only user message
    expect(result.current.error).toBe('Network error');
    expect(result.current.isLoading).toBe(false);
  });

  it('should clear messages and error', async () => {
    mockedSearch.mockRejectedValueOnce(new Error('fail'));

    const { result } = renderHook(() => useChat('session-1'));
    await act(async () => {
      await result.current.sendMessage('hello');
    });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.error).toBe('fail');

    act(() => {
      result.current.clearMessages();
    });
    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});
