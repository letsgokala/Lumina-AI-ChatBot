import React from 'react';
import { PanelLeftOpen, Sparkles } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { generateChatResponse } from '../services/gemini';

export const ChatWindow = () => {
  const {
    sessions,
    currentSessionId,
    isSidebarOpen,
    setSidebarOpen,
    createNewSession,
    addMessage,
  } = useChatStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const currentSession = sessions.find((session) => session.id === currentSessionId);

  const handleSend = async (content: string, attachment?: string) => {
    const sessionId = currentSessionId || createNewSession();
    const nextMessages = [
      ...(sessions.find((session) => session.id === sessionId)?.messages || []),
      {
        id: crypto.randomUUID(),
        role: 'user' as const,
        content,
        timestamp: Date.now(),
        attachment,
      },
    ];

    addMessage(sessionId, nextMessages[nextMessages.length - 1]);
    setIsLoading(true);

    try {
      const assistantReply = await generateChatResponse(nextMessages);
      addMessage(sessionId, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: assistantReply,
        timestamp: Date.now(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to generate a response.';
      addMessage(sessionId, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${message}`,
        timestamp: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="workspace-main">
      <header className="chat-header">
        {!isSidebarOpen && (
          <button type="button" className="icon-button" onClick={() => setSidebarOpen(true)}>
            <PanelLeftOpen size={18} />
          </button>
        )}
        <div>
          <p className="eyebrow">Assistant</p>
          <h2>{currentSession?.title || 'New Chat'}</h2>
        </div>
      </header>

      {!currentSession || currentSession.messages.length === 0 ? (
        <div className="chat-empty">
          <div className="chat-empty-icon">
            <Sparkles size={24} />
          </div>
          <h1>Start a conversation</h1>
          <p className="subtitle">
            Session controls are in place. Next up is wiring the composer and message list.
          </p>
        </div>
      ) : (
        <div className="message-feed">
          {currentSession.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      )}

      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </section>
  );
};
