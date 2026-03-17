// Feature: notion-search-chatbot, Property 4: 새 대화 생성 후 빈 메시지 리스트 + 세션 목록 길이 1 증가
// Validates: Requirements 2.2

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import { useSessions } from '../useSessions';
import type { Session } from '../../types';

vi.mock('../../../../utils/api', () => ({
  api: {
    getSessions: vi.fn(),
  },
}));

import { api } from '../../../../utils/api';

const mockedGetSessions = vi.mocked(api.getSessions);

const isoDateArb = fc
  .integer({ min: new Date('2020-01-01').getTime(), max: new Date('2030-01-01').getTime() })
  .map((ts) => new Date(ts).toISOString());

const sessionArb: fc.Arbitrary<Session> = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  createdAt: isoDateArb,
  updatedAt: isoDateArb,
});

beforeEach(() => {
  vi.clearAllMocks();
  let counter = 0;
  vi.stubGlobal('crypto', {
    randomUUID: () => `new-session-${counter++}`,
  });
});

describe('Property 4: 새 대화 생성 후 빈 메시지 리스트 + 세션 목록 길이 1 증가', () => {
  it(
    'should increase sessions length by 1 and set activeSessionId after createSession',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(sessionArb, { minLength: 0, maxLength: 20 }),
          async (initialSessions) => {
            mockedGetSessions.mockResolvedValueOnce({ sessions: initialSessions });

            const { result } = renderHook(() => useSessions());

            await waitFor(() => {
              expect(result.current.isLoading).toBe(false);
            });

            const lengthBefore = result.current.sessions.length;

            let newSession: ReturnType<typeof result.current.createSession>;
            act(() => {
              newSession = result.current.createSession();
            });

            // sessions array length should increase by 1
            expect(result.current.sessions).toHaveLength(lengthBefore + 1);

            // activeSessionId should be set to the new session's id
            expect(result.current.activeSessionId).toBe(newSession!.id);

            // The new session should exist in the sessions array
            expect(result.current.sessions.some((s) => s.id === newSession!.id)).toBe(true);
          },
        ),
        { numRuns: 100 },
      );
    },
    60_000,
  );
});
