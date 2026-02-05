export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachment?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  pinned?: boolean;
  createdAt: number;
  updatedAt: number;
}
