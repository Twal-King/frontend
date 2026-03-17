import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionSidebar } from '../SessionSidebar';
import type { Session } from '../../types';

function makeSession(overrides: Partial<Session> & { id: string }): Session {
  return {
    title: `Session ${overrides.id}`,
    createdAt: overrides.updatedAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('SessionSidebar', () => {
  const now = new Date();
  const today = now.toISOString();
  const yesterday = new Date(now.getTime() - 86_400_000).toISOString();
  const lastWeek = new Date(now.getTime() - 7 * 86_400_000).toISOString();

  const sessions: Session[] = [
    makeSession({ id: '1', title: '오늘 대화', updatedAt: today }),
    makeSession({ id: '2', title: '어제 대화', updatedAt: yesterday }),
    makeSession({ id: '3', title: '지난주 대화', updatedAt: lastWeek }),
  ];

  it('renders 새 대화 button', () => {
    render(
      <SessionSidebar
        sessions={[]}
        activeSessionId={null}
        onNewSession={vi.fn()}
        onSelectSession={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /새 대화/ })).toBeInTheDocument();
  });

  it('calls onNewSession when 새 대화 button is clicked', async () => {
    const onNewSession = vi.fn();
    render(
      <SessionSidebar
        sessions={[]}
        activeSessionId={null}
        onNewSession={onNewSession}
        onSelectSession={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /새 대화/ }));
    expect(onNewSession).toHaveBeenCalledOnce();
  });

  it('renders all sessions', () => {
    render(
      <SessionSidebar
        sessions={sessions}
        activeSessionId={null}
        onNewSession={vi.fn()}
        onSelectSession={vi.fn()}
      />
    );
    expect(screen.getByText('오늘 대화')).toBeInTheDocument();
    expect(screen.getByText('어제 대화')).toBeInTheDocument();
    expect(screen.getByText('지난주 대화')).toBeInTheDocument();
  });

  it('groups sessions by date (오늘, 어제, 이전)', () => {
    render(
      <SessionSidebar
        sessions={sessions}
        activeSessionId={null}
        onNewSession={vi.fn()}
        onSelectSession={vi.fn()}
      />
    );
    expect(screen.getByText('오늘')).toBeInTheDocument();
    expect(screen.getByText('어제')).toBeInTheDocument();
    expect(screen.getByText('이전')).toBeInTheDocument();
  });

  it('highlights the active session with bg-hover', () => {
    render(
      <SessionSidebar
        sessions={sessions}
        activeSessionId="1"
        onNewSession={vi.fn()}
        onSelectSession={vi.fn()}
      />
    );
    const activeButton = screen.getByText('오늘 대화');
    expect(activeButton.className).toContain('bg-hover');
    expect(activeButton.className).toContain('text-primary');
  });

  it('calls onSelectSession with session id when clicked', async () => {
    const onSelectSession = vi.fn();
    render(
      <SessionSidebar
        sessions={sessions}
        activeSessionId={null}
        onNewSession={vi.fn()}
        onSelectSession={onSelectSession}
      />
    );
    await userEvent.click(screen.getByText('어제 대화'));
    expect(onSelectSession).toHaveBeenCalledWith('2');
  });

  it('renders empty sidebar when no sessions', () => {
    render(
      <SessionSidebar
        sessions={[]}
        activeSessionId={null}
        onNewSession={vi.fn()}
        onSelectSession={vi.fn()}
      />
    );
    expect(screen.queryByText('오늘')).not.toBeInTheDocument();
    expect(screen.queryByText('어제')).not.toBeInTheDocument();
    expect(screen.queryByText('이전')).not.toBeInTheDocument();
  });
});
