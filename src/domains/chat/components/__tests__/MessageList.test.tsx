import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MessageList } from '../MessageList';
import type { Message } from '../../types';

function makeMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: '1',
    sessionId: 's1',
    role: 'user',
    content: 'Hello',
    createdAt: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('MessageList', () => {
  const noop = () => {};

  it('renders messages sorted by createdAt ascending', () => {
    const messages: Message[] = [
      makeMessage({ id: '2', content: 'Second', createdAt: '2024-01-01T02:00:00Z' }),
      makeMessage({ id: '1', content: 'First', createdAt: '2024-01-01T01:00:00Z' }),
      makeMessage({ id: '3', content: 'Third', createdAt: '2024-01-01T03:00:00Z' }),
    ];

    render(<MessageList messages={messages} isLoading={false} error={null} onRetry={noop} />);

    const items = screen.getAllByText(/First|Second|Third/);
    expect(items[0]).toHaveTextContent('First');
    expect(items[1]).toHaveTextContent('Second');
    expect(items[2]).toHaveTextContent('Third');
  });

  it('shows typing indicator when isLoading is true', () => {
    render(<MessageList messages={[]} isLoading={true} error={null} onRetry={noop} />);

    expect(screen.getByRole('status', { name: '응답 생성 중' })).toBeInTheDocument();
  });

  it('hides typing indicator when isLoading is false', () => {
    render(
      <MessageList
        messages={[makeMessage()]}
        isLoading={false}
        error={null}
        onRetry={noop}
      />,
    );

    expect(screen.queryByRole('status', { name: '응답 생성 중' })).not.toBeInTheDocument();
  });

  it('shows error message and retry button when error is set', () => {
    const onRetry = vi.fn();
    render(
      <MessageList messages={[]} isLoading={false} error="네트워크 오류" onRetry={onRetry} />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('네트워크 오류')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: '재시도' });
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('shows empty state message when messages is empty and not loading', () => {
    render(<MessageList messages={[]} isLoading={false} error={null} onRetry={noop} />);

    expect(screen.getByText('관련 정보를 찾을 수 없습니다')).toBeInTheDocument();
  });

  it('does not show empty state when loading', () => {
    render(<MessageList messages={[]} isLoading={true} error={null} onRetry={noop} />);

    expect(screen.queryByText('관련 정보를 찾을 수 없습니다')).not.toBeInTheDocument();
  });

  it('does not show empty state when error is present', () => {
    render(<MessageList messages={[]} isLoading={false} error="Error" onRetry={noop} />);

    expect(screen.queryByText('관련 정보를 찾을 수 없습니다')).not.toBeInTheDocument();
  });
});
