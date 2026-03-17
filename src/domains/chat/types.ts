export interface Source {
  title: string;
  url: string;
  pageId: string;
}

export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  createdAt: string;
}

export interface Session {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatState {
  sessions: Session[];
  activeSessionId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
