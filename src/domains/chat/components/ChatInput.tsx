import { useState, type KeyboardEvent, type FormEvent } from 'react';
import { cn } from '@/utils/cn';

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({ onSend, disabled = false, className }: ChatInputProps) {
  const [value, setValue] = useState('');

  const canSend = value.trim().length > 0 && !disabled;

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'sticky bottom-0 flex items-center gap-3 bg-main px-4 py-3 border-t border-border',
        className
      )}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요..."
        disabled={disabled}
        className={cn(
          'flex-1 bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-primary',
          'placeholder:text-disabled outline-none',
          'focus:border-border-focus transition-colors'
        )}
      />
      <button
        type="submit"
        disabled={!canSend}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors rounded-xl',
          'bg-accent text-white px-4 py-2.5 text-sm hover:bg-accent-hover',
          'disabled:opacity-40 disabled:cursor-not-allowed'
        )}
      >
        전송
      </button>
    </form>
  );
}
