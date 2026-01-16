import React from 'react';
import { Plus, MessageSquare, PanelLeftClose, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useChatStore } from '../store/useChatStore';

export const Sidebar = () => {
  const {
    sessions,
    currentSessionId,
    isSidebarOpen,
    setSidebarOpen,
    createNewSession,
    setCurrentSession,
    deleteSession,
  } = useChatStore();

  return (
    <aside className={isSidebarOpen ? 'workspace-sidebar' : 'workspace-sidebar is-collapsed'}>
      <div className="sidebar-header">
        <div>
          <p className="eyebrow">Lumina</p>
          <h2>Sessions</h2>
        </div>
        <button type="button" className="icon-button" onClick={() => setSidebarOpen(false)}>
          <PanelLeftClose size={18} />
        </button>
      </div>

      <button type="button" className="primary-button" onClick={() => createNewSession()}>
        <Plus size={16} />
        <span>New Chat</span>
      </button>

      <div className="session-list">
        {sessions.length === 0 ? (
          <p className="empty-copy">Your recent chats will appear here.</p>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              className={currentSessionId === session.id ? 'session-item is-active' : 'session-item'}
              onClick={() => setCurrentSession(session.id)}
            >
              <MessageSquare size={15} />
              <span className="session-copy">
                <strong>{session.title}</strong>
                <small>{format(session.updatedAt, 'MMM d, h:mm a')}</small>
              </span>
              <span
                className="session-delete"
                onClick={(event) => {
                  event.stopPropagation();
                  deleteSession(session.id);
                }}
              >
                <Trash2 size={14} />
              </span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};
