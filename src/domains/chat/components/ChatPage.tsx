import { useChat } from '../hooks/useChat';
import { useSessions } from '../hooks/useSessions';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { SessionSidebar } from './SessionSidebar';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Spinner } from '@/components/Spinner';

export function ChatPage() {
  const {
    sessions,
    activeSessionId,
    createSession,
    switchSession,
    deleteSession,
  } = useSessions();

  const { messages, isLoading, isLoadingHistory, error, sendMessage, clearMessages, retry } =
    useChat(activeSessionId);

  const { bottomRef } = useAutoScroll([messages]);

  const handleNewSession = async () => {
    clearMessages();
    await createSession();
  };

  const handleSwitchSession = (sessionId: string) => {
    switchSession(sessionId);
  };

  const handleSend = async (query: string) => {
    // Auto-create session if none active
    if (!activeSessionId) {
      const session = await createSession();
      if (session) {
        // Small delay to let state settle, then send
        setTimeout(() => sendMessage(query), 50);
        return;
      }
    }
    sendMessage(query);
  };

  return (
    <div className="flex h-full w-full">
      <SessionSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewSession={handleNewSession}
        onSelectSession={handleSwitchSession}
        onDeleteSession={deleteSession}
      />

      <main className="flex flex-1 flex-col min-w-0">
        <div className="flex flex-1 flex-col mx-auto w-full max-w-chat overflow-hidden">
          {isLoadingHistory ? (
            <div className="flex flex-1 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <MessageList
              messages={messages}
              isLoading={isLoading}
              error={error}
              onRetry={retry}
            />
          )}
          <div ref={bottomRef} />
          <ChatInput onSend={handleSend} disabled={isLoading || isLoadingHistory} />
        </div>
      </main>
    </div>
  );
}
