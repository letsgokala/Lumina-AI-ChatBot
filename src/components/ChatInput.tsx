import React, { useRef, useState, useEffect } from 'react';
import { Paperclip, Mic, ArrowUp, X, MicOff, Square } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatInputProps {
  onSend: (content: string, attachment?: string) => void;
  isLoading: boolean;
  onStop?: () => void;
}

export const ChatInput = ({ onSend, isLoading, onStop }: ChatInputProps) => {
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadAttachment = (file?: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAttachment(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    loadAttachment(e.target.files?.[0]);
  };

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser does not support speech recognition.");

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    
    if (!isListening) {
      recognition.start();
      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setContent(prev => prev + " " + transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
    }
  };

  const handleSend = () => {
    if ((content.trim() || attachment) && !isLoading) {
      onSend(content.trim(), attachment || undefined);
      setContent('');
      setAttachment(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isLoading) {
      return;
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height = '0px';
    const nextHeight = Math.min(textareaRef.current.scrollHeight, 200);
    textareaRef.current.style.height = `${nextHeight}px`;
  }, [content]);

  return (
    <div className="p-4 max-w-4xl mx-auto w-full">
      {attachment && (
        <div className="relative inline-block mb-2 ml-4">
          <img src={attachment} alt="Selected upload preview" className="w-20 h-20 object-cover rounded-lg border border-white/10" />
          <button type="button" onClick={() => setAttachment(null)} className="absolute -top-2 -right-2 bg-black rounded-full p-1 border border-white/10">
            <X size={12} />
          </button>
        </div>
      )}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDraggingFile(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsDraggingFile(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDraggingFile(false);
          const imageFile = Array.from(event.dataTransfer.files).find((file) => file.type.startsWith('image/'));
          loadAttachment(imageFile);
        }}
        className={cn(
          "relative bg-brand-surface border border-brand-border rounded-2xl p-2 shadow-2xl focus-within:border-white/20 transition-all",
          isDraggingFile && "border-sky-400/70 bg-sky-500/8"
        )}
      >
        {isDraggingFile && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl border border-dashed border-sky-400/50 bg-sky-500/10 text-sm font-medium text-sky-200 backdrop-blur-sm">
            Drop an image to attach it
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Lumina..."
          className="w-full bg-transparent border-none focus:ring-0 resize-none py-3 px-4 text-sm max-h-[200px] overflow-y-auto"
          rows={1}
        />
        <div className="flex items-center justify-between px-2 pb-1">
          <div className="flex items-center gap-1">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-white/5 rounded-lg text-brand-muted hover:text-white">
              <Paperclip size={18} />
            </button>
            <button type="button" onClick={toggleListening} className={cn("p-2 rounded-lg transition-all", isListening ? "text-red-400 bg-red-500/10" : "text-brand-muted hover:text-white")}>
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>
          {isLoading ? (
            <button
              type="button"
              onClick={onStop}
              className="p-2 rounded-xl transition-all bg-red-500/15 text-red-300 hover:bg-red-500/25"
            >
              <Square size={18} fill="currentColor" />
            </button>
          ) : (
            <button type="button" onClick={handleSend} disabled={(!content.trim() && !attachment) || isLoading} className={cn("p-2 rounded-xl transition-all", content.trim() || attachment ? "bg-white text-black" : "bg-white/5 text-brand-muted")}>
              <ArrowUp size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
