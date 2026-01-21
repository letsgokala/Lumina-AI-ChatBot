import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, User } from 'lucide-react';
import { Message } from '../types/chat';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isAssistant = message.role === 'assistant';

  return (
    <article className={isAssistant ? 'message-row message-row-assistant' : 'message-row'}>
      <div className={isAssistant ? 'message-icon assistant' : 'message-icon user'}>
        {isAssistant ? <Sparkles size={15} /> : <User size={15} />}
      </div>
      <div className="message-copy">
        <p className="message-label">{isAssistant ? 'Lumina' : 'You'}</p>
        {message.attachment && <img src={message.attachment} className="message-image" alt="Attachment" />}
        <div className="message-markdown">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
};
