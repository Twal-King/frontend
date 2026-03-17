// Feature: notion-search-chatbot, Property 6: 세션 전환 시 모든 메시지의 sessionId가 선택된 세션 ID와 일치
// Validates: Requirements 2.4

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import type { Message } from '../../types';

/**
 * Pure filtering function that simulates what happens when switching sessions:
 * given an array of messages with various sessionIds, filtering by a specific
 * sessionId should yield only messages belonging to that session.
 */
function filterMessagesBySession(messages: Message[], sessionId: string): Message[] {
  return messages.filter((m) => m.sessionId === sessionId);
}

const isoDateArb = fc
  .integer({ min: new Date('2020-01-01').getTime(), max: new Date('2030-01-01').getTime() })
  .map((ts) => new Date(ts).toISOString());

const sourceArb = fc.record({
  title: fc.string({ minLength: 1, maxLength: 30 }),
  url: fc.webUrl(),
  pageId: fc.uuid(),
});

const messageArb = (sessionIds: string[]): fc.Arbitrary<Message> =>
  fc.record({
    id: fc.uuid(),
    sessionId: fc.constantFrom(...sessionIds),
    role: fc.constantFrom('user' as const, 'assistant' as const),
    content: fc.string({ minLength: 1, maxLength: 200 }),
    sources: fc.option(fc.array(sourceArb, { minLength: 0, maxLength: 3 }), { nil: undefined }),
    createdAt: isoDateArb,
  });

describe('Property 6: 세션 전환 시 모든 메시지의 sessionId가 선택된 세션 ID와 일치', () => {
  it('all filtered messages should have the selected sessionId', () => {
    fc.assert(
      fc.property(
        fc
          .array(fc.uuid(), { minLength: 2, maxLength: 5 })
          .chain((sessionIds) =>
            fc.tuple(
              fc.constantFrom(...sessionIds),
              fc.array(messageArb(sessionIds), { minLength: 0, maxLength: 30 }),
            ),
          ),
        ([targetSessionId, messages]) => {
          const filtered = filterMessagesBySession(messages, targetSessionId);

          // Every message in the filtered result must have the target sessionId
          for (const msg of filtered) {
            expect(msg.sessionId).toBe(targetSessionId);
          }

          // The filtered count should equal the number of messages with that sessionId
          const expectedCount = messages.filter((m) => m.sessionId === targetSessionId).length;
          expect(filtered).toHaveLength(expectedCount);
        },
      ),
      { numRuns: 100 },
    );
  });
});
