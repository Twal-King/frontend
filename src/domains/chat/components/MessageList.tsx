import { cn } from '@/utils/cn';
import { formatRelativeTime } from '@/utils/format';
import { Button } from '@/components/Button';
import { MessageBubble } from './MessageBubble';
import type { Message } from '../types';

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function MessageList({ messages, isLoading, error, onRetry }: MessageListProps) {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const isEmpty = sorted.length === 0 && !isLoading && !error;

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-y-auto p-6">
      {isEmpty && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
          <p className="text-xl font-semibold text-primary">💬</p>
          <p className="text-secondary text-sm" role="status">
            새 대화를 시작하거나 질문을 입력하세요
          </p>
        </div>
      )}

      {sorted.map((msg) => (
        <MessageBubble
          key={msg.id}
          role={msg.role}
          content={msg.content}
          sources={msg.sources}
          timestamp={formatRelativeTime(msg.createdAt)}
        />
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div
            className={cn(
              'bg-card border border-border rounded-2xl px-4 py-3',
              'flex items-center gap-1.5',
            )}
            role="status"
            aria-label="응답 생성 중"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center gap-3 mt-4" role="alert">
          <p className="text-error text-sm">{error}</p>
          <Button variant="secondary" size="sm" onClick={onRetry}>
            재시도
          </Button>
        </div>
      )}
    </div>
  );
}
