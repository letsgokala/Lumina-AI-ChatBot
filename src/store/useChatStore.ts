import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSession, Message } from '../types/chat';

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  createNewSession: () => string;
  setCurrentSession: (id: string) => void;
  addMessage: (sessionId: string, message: Message) => void;
  updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void;
  togglePinnedSession: (id: string) => void;
  deleteSession: (id: string) => void;
  updateSessionTitle: (id: string, title: string) => void;
  clearAllSessions: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      sessions: [],
      currentSessionId: null,
      isSidebarOpen: true,

      setSidebarOpen: (open) => set({ isSidebarOpen: open }),

      createNewSession: () => {
        const newSession: ChatSession = {
          id: crypto.randomUUID(),
          title: 'New Chat',
          messages: [],
          pinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: newSession.id,
        }));

        return newSession.id;
      },

      setCurrentSession: (id) => set({ currentSessionId: id }),

      addMessage: (sessionId, message) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: [...s.messages, message],
                  updatedAt: Date.now(),
                  title: s.messages.length === 0 && message.role === 'user'
                    ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
                    : s.title
                }
              : s
          ),
        }));
      },

      updateMessage: (sessionId, messageId, updates) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: s.messages.map((message) =>
                    message.id === messageId ? { ...message, ...updates } : message
                  ),
                  updatedAt: Date.now(),
                }
              : s
          ),
        }));
      },

      togglePinnedSession: (id) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id
              ? {
                  ...s,
                  pinned: !s.pinned,
                  updatedAt: Date.now(),
                }
              : s
          ),
        }));
      },

      deleteSession: (id) => {
        set((state) => {
          const sessions = state.sessions.filter((session) => session.id !== id);
          return {
            sessions,
            currentSessionId: state.currentSessionId === id ? sessions[0]?.id || null : state.currentSessionId,
          };
        });
      },

      updateSessionTitle: (id, title) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? { ...session, title, updatedAt: Date.now() } : session
          ),
        }));
      },

      clearAllSessions: () => set({ sessions: [], currentSessionId: null }),
    }),
    {
      name: 'lumina-chat-storage',
    }
  )
);
