import React, { useRef, useState } from 'react';
import { ArrowUp, Paperclip, X } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string, attachment?: string) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSend, isLoading = false }: ChatInputProps) => {
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setAttachment(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSend = () => {
    if ((!content.trim() && !attachment) || isLoading) {
      return;
    }

    onSend(content.trim(), attachment || undefined);
    setContent('');
    setAttachment(null);
  };

  return (
    <div className="chat-input-shell">
      {attachment && (
        <div className="attachment-preview">
          <img src={attachment} alt="Selected upload preview" />
          <button type="button" className="icon-button" onClick={() => setAttachment(null)}>
            <X size={14} />
          </button>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={handleFileChange}
      />
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Message Lumina..."
        rows={1}
        className="chat-input"
      />
      <button type="button" className="icon-button" onClick={() => fileInputRef.current?.click()}>
        <Paperclip size={18} />
      </button>
      <button type="button" className="send-button" onClick={handleSend}>
        <ArrowUp size={18} />
      </button>
    </div>
  );
};
