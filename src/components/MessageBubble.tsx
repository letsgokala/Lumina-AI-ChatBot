import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types/chat';
import { cn } from '../lib/utils';
import { User, Sparkles } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isAssistant = message.role === 'assistant';
  const isStreamingPlaceholder = isAssistant && !message.content && !message.attachment;

  return (
    <div className={cn("flex gap-4 p-6 transition-colors", isAssistant ? "bg-white/2" : "bg-transparent")}>
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", isAssistant ? "bg-white/10" : "bg-white text-black")}>
        {isAssistant ? <Sparkles size={15} /> : <User size={15} />}
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-40">{isAssistant ? "Lumina AI" : "You"}</p>
        {message.attachment && (
          <img src={message.attachment} className="max-w-sm rounded-lg border border-white/10 mb-2" alt="Upload" />
        )}
        <div className="prose prose-invert prose-sm max-w-none">
          {isStreamingPlaceholder ? (
            <div className="flex items-center gap-1 py-2">
              <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce" />
            </div>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};
