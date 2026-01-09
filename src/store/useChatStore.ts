import { create } from 'zustand';
import { ChatSession, Message } from '../types/chat';

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  createNewSession: () => string;
  setCurrentSession: (id: string) => void;
  addMessage: (sessionId: string, message: Message) => void;
  deleteSession: (id: string) => void;
  clearAllSessions: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  sessions: [],
  currentSessionId: null,
  isSidebarOpen: true,

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  createNewSession: () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
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
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: [...session.messages, message],
              updatedAt: Date.now(),
            }
          : session
      ),
    }));
  },

  deleteSession: (id) => {
    set((state) => ({
      sessions: state.sessions.filter((session) => session.id !== id),
      currentSessionId: state.currentSessionId === id ? null : state.currentSessionId,
    }));
  },

  clearAllSessions: () => set({ sessions: [], currentSessionId: null }),
}));
