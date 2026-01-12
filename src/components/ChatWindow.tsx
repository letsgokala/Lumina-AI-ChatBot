import React from 'react';
import { PanelLeftOpen, Sparkles } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';

export const ChatWindow = () => {
  const {
    sessions,
    currentSessionId,
    isSidebarOpen,
    setSidebarOpen,
    createNewSession,
    addMessage,
  } = useChatStore();
  const currentSession = sessions.find((session) => session.id === currentSessionId);

  const handleSend = (content: string) => {
    const sessionId = currentSessionId || createNewSession();

    addMessage(sessionId, {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    });

    addMessage(sessionId, {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Assistant integration is next on the roadmap.',
      timestamp: Date.now(),
    });
  };

  return (
    <section className="workspace-main">
      <header className="chat-header">
        {!isSidebarOpen && (
          <button type="button" className="icon-button" onClick={() => setSidebarOpen(true)}>
            <PanelLeftOpen size={18} />
          </button>
        )}
        <span className="eyebrow">Assistant</span>
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

      <ChatInput onSend={handleSend} />
    </section>
  );
};
