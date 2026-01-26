import React from 'react';
import { useRef, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { Message } from '../types/chat';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { streamChatResponse } from '../services/gemini';
import { PanelLeftOpen, Sparkles, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export const ChatWindow = () => {
  const {
    sessions,
    currentSessionId,
    isSidebarOpen,
    setSidebarOpen,
    createNewSession,
    addMessage,
    updateMessage,
  } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const currentSession = sessions.find((session) => session.id === currentSessionId);
  const lastUserMessageIndex = currentSession
    ? [...currentSession.messages].reverse().findIndex((message) => message.role === 'user')
    : -1;
  const resolvedLastUserMessageIndex =
    lastUserMessageIndex >= 0 && currentSession
      ? currentSession.messages.length - 1 - lastUserMessageIndex
      : -1;
  const canRegenerate = !isStreaming && !!currentSession && resolvedLastUserMessageIndex >= 0;

  const handleScroll = () => {
    if (!scrollRef.current) {
      return;
    }

    const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
    shouldAutoScrollRef.current = scrollHeight - (scrollTop + clientHeight) < 96;
  };

  const handleStopGenerating = () => {
    abortControllerRef.current?.abort();
  };

  const streamAssistantResponse = async (
    sessionId: string,
    messages: Message[],
    assistantMessageId: string
  ) => {
    setIsStreaming(true);
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    let latestStreamedContent = '';

    try {
      const assistantReply = await streamChatResponse(messages, (partialContent) => {
        latestStreamedContent = partialContent;
        updateMessage(sessionId, assistantMessageId, {
          content: partialContent,
        });
      }, abortController.signal);

      updateMessage(sessionId, assistantMessageId, {
        content: assistantReply,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        if (!latestStreamedContent) {
          updateMessage(sessionId, assistantMessageId, {
            content: '_Generation stopped._',
          });
        }
        return;
      }

      const message = error instanceof Error ? error.message : 'Unable to generate a response.';
      updateMessage(sessionId, assistantMessageId, {
        content: `Error: ${message}`,
      });
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
      setIsStreaming(false);
    }
  };

  const handleSend = async (content: string, attachment?: string) => {
    const sessionId = currentSessionId || createNewSession();
    const nextMessages = [
      ...(sessions.find((session) => session.id === sessionId)?.messages || []),
      {
        id: crypto.randomUUID(),
        role: 'user' as const,
        content,
        timestamp: Date.now(),
        attachment,
      },
    ];

    addMessage(sessionId, nextMessages[nextMessages.length - 1]);
    const assistantMessageId = crypto.randomUUID();
    addMessage(sessionId, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    });

    await streamAssistantResponse(sessionId, nextMessages, assistantMessageId);
  };

  const handleRegenerate = async () => {
    if (!currentSession || resolvedLastUserMessageIndex < 0) {
      return;
    }

    const existingAssistantMessage = currentSession.messages.find(
      (message, index) => index > resolvedLastUserMessageIndex && message.role === 'assistant'
    );

    const assistantMessageId = existingAssistantMessage?.id ?? crypto.randomUUID();
    const messagesToReplay = currentSession.messages.slice(0, resolvedLastUserMessageIndex + 1);

    if (existingAssistantMessage) {
      updateMessage(currentSession.id, assistantMessageId, {
        content: '',
        timestamp: Date.now(),
      });
    } else {
      addMessage(currentSession.id, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      });
    }

    shouldAutoScrollRef.current = true;
    await streamAssistantResponse(currentSession.id, messagesToReplay, assistantMessageId);
  };

  useEffect(() => {
    if (scrollRef.current && shouldAutoScrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentSession?.messages, isStreaming]);

  return (
    <div className="flex-1 flex flex-col h-screen bg-brand-bg relative overflow-hidden">
      <header className="h-16 border-b border-brand-border flex items-center px-6 justify-between bg-brand-bg/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          {!isSidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <PanelLeftOpen size={18} />
            </button>
          )}
          <h2 className="text-sm font-medium opacity-80">
            {currentSession?.title || "New Chat"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={!canRegenerate}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-medium tracking-wider uppercase opacity-70 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
          >
            <RotateCcw size={12} />
            <span>Regenerate</span>
          </button>
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-medium tracking-wider uppercase opacity-60">
            Gemini 3 Flash
          </div>
        </div>
      </header>

      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        {!currentSession || currentSession.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10"
            >
              <Sparkles size={32} className="text-white" />
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-semibold tracking-tight mb-2"
            >
              How can I help you today?
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-brand-muted max-w-md text-sm leading-relaxed"
            >
              Lumina is your premium AI workspace. Ask questions, generate content, or explore ideas with the power of Gemini.
            </motion.p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full py-4">
            {currentSession.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-linear-to-t from-brand-bg via-brand-bg to-transparent pt-12">
        <ChatInput onSend={handleSend} onStop={handleStopGenerating} isLoading={isStreaming} />
      </div>
    </div>
  );
};
