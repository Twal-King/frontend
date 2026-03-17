import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSessions } from '../useSessions';

vi.mock('../../../../utils/api', () => ({
  api: {
    getSessions: vi.fn(),
  },
}));

import { api } from '../../../../utils/api';

const mockedGetSessions = vi.mocked(api.getSessions);

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('crypto', {
    randomUUID: () => 'new-session-id',
  });
});

describe('useSessions', () => {
  it('should fetch sessions on mount', async () => {
    const sessions = [
      { id: 's1', title: 'Session 1', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    ];
    mockedGetSessions.mockResolvedValueOnce({ sessions });

    const { result } = renderHook(() => useSessions());

    await waitFor(() => {
      expect(result.current.sessions).toEqual(sessions);
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle fetch error gracefully', async () => {
    mockedGetSessions.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSessions());

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    });
    expect(result.current.sessions).toEqual([]);
  });

  it('should create a new session and set it as active', async () => {
    mockedGetSessions.mockResolvedValueOnce({ sessions: [] });

    const { result } = renderHook(() => useSessions());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let newSession: ReturnType<typeof result.current.createSession>;
    act(() => {
      newSession = result.current.createSession();
    });

    expect(result.current.sessions).toHaveLength(1);
    expect(result.current.sessions[0].id).toBe('new-session-id');
    expect(result.current.sessions[0].title).toBe('새 대화');
    expect(result.current.activeSessionId).toBe('new-session-id');
    expect(newSession!.id).toBe('new-session-id');
  });

  it('should prepend new session to existing sessions', async () => {
    const existing = [
      { id: 's1', title: 'Old', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    ];
    mockedGetSessions.mockResolvedValueOnce({ sessions: existing });

    const { result } = renderHook(() => useSessions());

    await waitFor(() => {
      expect(result.current.sessions).toHaveLength(1);
    });

    act(() => {
      result.current.createSession();
    });

    expect(result.current.sessions).toHaveLength(2);
    expect(result.current.sessions[0].id).toBe('new-session-id');
  });

  it('should switch active session', async () => {
    mockedGetSessions.mockResolvedValueOnce({ sessions: [] });

    const { result } = renderHook(() => useSessions());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.switchSession('target-session');
    });

    expect(result.current.activeSessionId).toBe('target-session');
  });
});
