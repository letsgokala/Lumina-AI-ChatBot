import React from 'react';
import { useChatStore } from '../store/useChatStore';
import { Plus, MessageSquare, Trash2, PanelLeftClose, Pencil, Check, X, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export const Sidebar = () => {
  const {
    sessions,
    currentSessionId,
    isSidebarOpen,
    setSidebarOpen,
    createNewSession,
    setCurrentSession,
    updateSessionTitle,
    deleteSession,
    clearAllSessions,
  } = useChatStore();
  const [editingSessionId, setEditingSessionId] = React.useState<string | null>(null);
  const [titleDraft, setTitleDraft] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

  const startEditingSession = (sessionId: string, title: string) => {
    setEditingSessionId(sessionId);
    setTitleDraft(title);
  };

  const saveSessionTitle = (sessionId: string) => {
    const nextTitle = titleDraft.trim() || 'New Chat';
    updateSessionTitle(sessionId, nextTitle);
    setEditingSessionId(null);
  };

  const cancelEditingSession = () => {
    setEditingSessionId(null);
    setTitleDraft('');
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredSessions = sessions.filter((session) => {
    if (!normalizedQuery) {
      return true;
    }

    const messageMatch = session.messages.some((message) =>
      message.content.toLowerCase().includes(normalizedQuery)
    );

    return (
      session.title.toLowerCase().includes(normalizedQuery) ||
      messageMatch
    );
  });

  return (
    <div 
      className={cn(
        "h-screen bg-brand-surface border-r border-brand-border transition-all duration-300 flex flex-col",
        isSidebarOpen ? "w-72" : "w-0 overflow-hidden border-none"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Lumina</h1>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      <div className="px-4 mb-4">
        <button 
          onClick={() => createNewSession()}
          className="w-full flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="px-4 mb-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2 focus-within:border-white/15">
          <Search size={15} className="text-brand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats"
            className="w-full bg-transparent text-sm text-white placeholder:text-brand-muted outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {filteredSessions.length === 0 ? (
          <div className="px-4 py-6 text-center text-xs text-brand-muted">
            No chats match "{searchQuery}".
          </div>
        ) : filteredSessions.map((session) => (
          <div 
            key={session.id}
            className={cn(
              "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all",
              currentSessionId === session.id 
                ? "bg-white/10 text-white" 
                : "text-brand-muted hover:bg-white/5 hover:text-white"
            )}
            onClick={() => {
              if (!editingSessionId) {
                setCurrentSession(session.id);
              }
            }}
          >
            <MessageSquare size={16} />
            <div className="flex-1 min-w-0">
              {editingSessionId === session.id ? (
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      saveSessionTitle(session.id);
                    }

                    if (e.key === 'Escape') {
                      e.preventDefault();
                      cancelEditingSession();
                    }
                  }}
                  onBlur={() => saveSessionTitle(session.id)}
                  className="w-full bg-white/10 rounded-md px-2 py-1 text-sm font-medium outline-none ring-1 ring-white/10"
                />
              ) : (
                <p className="text-sm font-medium truncate">{session.title}</p>
              )}
              <p className="text-[10px] opacity-50">
                {format(session.updatedAt, 'MMM d, h:mm a')}
              </p>
            </div>
            <div className="flex items-center">
              {editingSessionId === session.id ? (
                <>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      saveSessionTitle(session.id);
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-md transition-all"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      cancelEditingSession();
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-md transition-all"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingSession(session.id, session.title);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-md transition-all"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-brand-border space-y-4">
        <button 
          onClick={() => {
            if (confirm("Are you sure you want to clear all chat history?")) {
              clearAllSessions();
            }
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <Trash2 size={14} />
          <span>Clear All History</span>
        </button>
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">User Account</p>
            <p className="text-xs text-brand-muted truncate">Pro Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};
