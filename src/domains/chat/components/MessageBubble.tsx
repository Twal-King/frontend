import { cn } from '@/utils/cn';

export interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; url: string }[];
  timestamp: string;
}

export function MessageBubble({ role, content, sources, timestamp }: MessageBubbleProps) {
  const isUser = role === 'user';
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3 text-sm',
          isUser
            ? 'bg-accent text-white'
            : 'bg-card border border-border text-primary'
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        {sources && sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border space-y-1">
            {sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-accent hover:underline"
              >
                📎 {source.title}
              </a>
            ))}
          </div>
        )}
        <span className="block mt-1.5 text-xs text-secondary/60">{timestamp}</span>
      </div>
    </div>
  );
}
