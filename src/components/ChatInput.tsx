import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSend, isLoading = false }: ChatInputProps) => {
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (!content.trim() || isLoading) {
      return;
    }

    onSend(content.trim());
    setContent('');
  };

  return (
    <div className="chat-input-shell">
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Message Lumina..."
        rows={1}
        className="chat-input"
      />
      <button type="button" className="send-button" onClick={handleSend}>
        <ArrowUp size={18} />
      </button>
    </div>
  );
};
