import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types/chat';
import { cn } from '../lib/utils';
import { User, Sparkles, Copy, Check } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
}

type SyntaxHighlighterComponent = typeof import('react-syntax-highlighter').Prism;
type SyntaxTheme = typeof import('react-syntax-highlighter/dist/esm/styles/prism').oneDark;

const CodeBlock = ({ className, children }: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);
  const [Highlighter, setHighlighter] = React.useState<SyntaxHighlighterComponent | null>(null);
  const [theme, setTheme] = React.useState<SyntaxTheme | null>(null);
  const rawCode = React.Children.toArray(children).join('');
  const code = rawCode.replace(/\n$/, '');
  const language = className?.replace('language-', '') || 'text';

  React.useEffect(() => {
    let isMounted = true;

    Promise.all([
      import('react-syntax-highlighter'),
      import('react-syntax-highlighter/dist/esm/styles/prism'),
    ]).then(([syntaxModule, themeModule]) => {
      if (!isMounted) {
        return;
      }

      setHighlighter(() => syntaxModule.Prism);
      setTheme(themeModule.oneDark);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="not-prose my-4 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/45">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="overflow-x-auto p-4 text-[13px] leading-6 text-white/90">
        {Highlighter && theme ? (
          <Highlighter
            language={language}
            style={theme}
            customStyle={{
              margin: 0,
              padding: 0,
              background: 'transparent',
              fontSize: '13px',
              lineHeight: '1.65',
            }}
            codeTagProps={{
              style: {
                fontFamily: 'inherit',
              },
            }}
            wrapLongLines
          >
            {code}
          </Highlighter>
        ) : (
          <pre className="m-0 whitespace-pre-wrap break-words font-mono text-[13px] leading-6 text-white/90">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
};

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
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const isBlock = className?.startsWith('language-');

                  if (isBlock) {
                    return (
                      <CodeBlock className={className}>
                        {children}
                      </CodeBlock>
                    );
                  }

                  return (
                    <code
                      {...props}
                      className="rounded-md border border-white/10 bg-white/8 px-1.5 py-0.5 font-mono text-[0.9em] text-white"
                    >
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  return <>{children}</>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};
