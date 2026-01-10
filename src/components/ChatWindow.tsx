import React from 'react';
import { PanelLeftOpen, Sparkles } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

export const ChatWindow = () => {
  const { isSidebarOpen, setSidebarOpen } = useChatStore();

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

      <div className="chat-empty">
        <div className="chat-empty-icon">
          <Sparkles size={24} />
        </div>
        <h1>Start a conversation</h1>
        <p className="subtitle">
          Session controls are in place. Next up is wiring the composer and message list.
        </p>
      </div>
    </section>
  );
};
