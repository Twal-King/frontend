import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatPage } from '../ChatPage';

const mockSendMessage = vi.fn();
const mockClearMessages = vi.fn();
const mockRetry = vi.fn();
const mockCreateSession = vi.fn(() => ({
  id: 'new-session',
  title: '새 대화',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));
const mockSwitchSession = vi.fn();

vi.mock('../../hooks/useSessions', () => ({
  useSessions: () => ({
    sessions: [
      { id: 's1', title: '세션 1', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
      { id: 's2', title: '세션 2', createdAt: '2024-01-02T00:00:00Z', updatedAt: '2024-01-02T00:00:00Z' },
    ],
    activeSessionId: 's1',
    isLoading: false,
    error: null,
    fetchSessions: vi.fn(),
    createSession: mockCreateSession,
    switchSession: mockSwitchSession,
  }),
}));

vi.mock('../../hooks/useChat', () => ({
  useChat: () => ({
    messages: [
      { id: 'm1', sessionId: 's1', role: 'user' as const, content: '안녕하세요', createdAt: '2024-01-01T00:00:00Z' },
      { id: 'm2', sessionId: 's1', role: 'assistant' as const, content: '반갑습니다', createdAt: '2024-01-01T00:01:00Z' },
    ],
    isLoading: false,
    error: null,
    sendMessage: mockSendMessage,
    clearMessages: mockClearMessages,
    setMessages: vi.fn(),
    retry: mockRetry,
  }),
}));

vi.mock('../../hooks/useAutoScroll', () => ({
  useAutoScroll: () => ({
    bottomRef: { current: null },
  }),
}));

describe('ChatPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders SessionSidebar, MessageList, and ChatInput', () => {
    render(<ChatPage />);

    // SessionSidebar: new session button + session list
    expect(screen.getByText('+ 새 대화')).toBeInTheDocument();
    expect(screen.getByText('세션 1')).toBeInTheDocument();
    expect(screen.getByText('세션 2')).toBeInTheDocument();

    // MessageList: messages rendered
    expect(screen.getByText('안녕하세요')).toBeInTheDocument();
    expect(screen.getByText('반갑습니다')).toBeInTheDocument();

    // ChatInput: input + send button
    expect(screen.getByPlaceholderText('메시지를 입력하세요...')).toBeInTheDocument();
    expect(screen.getByText('전송')).toBeInTheDocument();
  });

  it('calls createSession and clearMessages when new session button is clicked', () => {
    render(<ChatPage />);

    fireEvent.click(screen.getByText('+ 새 대화'));

    expect(mockCreateSession).toHaveBeenCalledTimes(1);
    expect(mockClearMessages).toHaveBeenCalledTimes(1);
  });

  it('calls switchSession and clearMessages when a session is selected', () => {
    render(<ChatPage />);

    fireEvent.click(screen.getByText('세션 2'));

    expect(mockSwitchSession).toHaveBeenCalledWith('s2');
    expect(mockClearMessages).toHaveBeenCalledTimes(1);
  });

  it('calls sendMessage when a message is submitted', () => {
    render(<ChatPage />);

    const input = screen.getByPlaceholderText('메시지를 입력하세요...');
    fireEvent.change(input, { target: { value: '테스트 메시지' } });
    fireEvent.click(screen.getByText('전송'));

    expect(mockSendMessage).toHaveBeenCalledWith('테스트 메시지');
  });
});
