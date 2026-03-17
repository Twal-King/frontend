import { useChat } from '../hooks/useChat';
import { useSessions } from '../hooks/useSessions';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { SessionSidebar } from './SessionSidebar';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export function ChatPage() {
  const {
    sessions,
    activeSessionId,
    createSession,
    switchSession,
  } = useSessions();

  const { messages, isLoading, error, sendMessage, clearMessages, retry } =
    useChat(activeSessionId);

  const { bottomRef } = useAutoScroll([messages]);

  const handleNewSession = () => {
    createSession();
    clearMessages();
  };

  const handleSwitchSession = (sessionId: string) => {
    switchSession(sessionId);
    clearMessages();
  };

  return (
    <div className="flex h-full w-full">
      <SessionSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewSession={handleNewSession}
        onSelectSession={handleSwitchSession}
      />

      <main className="flex flex-1 flex-col min-w-0">
        <div className="flex flex-1 flex-col mx-auto w-full max-w-chat overflow-hidden">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            error={error}
            onRetry={retry}
          />
          <div ref={bottomRef} />
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </main>
    </div>
  );
}
