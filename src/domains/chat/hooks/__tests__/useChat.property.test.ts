// Feature: notion-search-chatbot, Property 1: 질문 전송 후 메시지 리스트 길이 2 증가
// Validates: Requirements 1.1, 1.2

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import fc from 'fast-check';
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
  let counter = 0;
  vi.stubGlobal('crypto', {
    randomUUID: () => `uuid-${counter++}`,
  });
});

describe('Property 1: 질문 전송 후 메시지 리스트 길이 2 증가', () => {
  it('should increase messages length by 2 after sending any non-empty query', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        async (query) => {
          mockedSearch.mockResolvedValueOnce({
            message: {
              id: 'ai-response-id',
              sessionId: 'session-1',
              role: 'assistant',
              content: `Response to: ${query}`,
              createdAt: new Date().toISOString(),
            },
          });

          const { result } = renderHook(() => useChat('session-1'));

          const lengthBefore = result.current.messages.length;

          await act(async () => {
            await result.current.sendMessage(query);
          });

          expect(result.current.messages).toHaveLength(lengthBefore + 2);
          expect(result.current.messages[lengthBefore].role).toBe('user');
          expect(result.current.messages[lengthBefore + 1].role).toBe('assistant');
        },
      ),
      { numRuns: 100 },
    );
  });
});
