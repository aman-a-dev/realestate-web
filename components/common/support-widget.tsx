"use client";

import { useEffect, useRef, useState, useCallback, memo, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { BRAND } from "@/lib/data";

type Role = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

interface SupportWidgetProps {
  apiEndpoint?: string;
  initialMessage?: ChatMessage;
}

const DEFAULT_INITIAL: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: `Hi 👋 I'm **${BRAND.name}** support. I can help you with **properties**, **pricing**, **locations**, **company info**, and pages like [Map](/map), [About](/about), and [Contact](/contact).\n\nWhat are you looking for today?`,
};

function createMarkdownComponents(isUser: boolean) {
  const linkClass = isUser
    ? "font-medium underline underline-offset-2 text-primary-foreground/90 hover:text-primary-foreground"
    : "font-medium text-primary underline underline-offset-2 hover:text-primary/80";

  const textClass = isUser ? "text-primary-foreground" : "text-foreground";
  const mutedTextClass = isUser
    ? "text-primary-foreground/80"
    : "text-muted-foreground";

  const subtleBorder = isUser
    ? "border-primary-foreground/25"
    : "border-border";

  const surfaceClass = isUser
    ? "bg-primary-foreground/10 text-primary-foreground"
    : "bg-muted text-foreground";

  return {
    a: ({ href = "", children }: any) => {
      if (!href) {
        return <span className={linkClass}>{children}</span>;
      }

      const isInternal = href.startsWith("/") || href.startsWith("#");

      if (isInternal) {
        return (
          <Link href={href} className={linkClass}>
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {children}
        </a>
      );
    },

    p: ({ children }: any) => (
      <p className={`whitespace-pre-wrap leading-relaxed ${textClass}`}>
        {children}
      </p>
    ),

    ul: ({ children }: any) => (
      <ul className={`list-disc space-y-1 pl-5 ${textClass}`}>{children}</ul>
    ),

    ol: ({ children }: any) => (
      <ol className={`list-decimal space-y-1 pl-5 ${textClass}`}>{children}</ol>
    ),

    li: ({ children }: any) => (
      <li className={`whitespace-pre-wrap leading-relaxed ${textClass}`}>
        {children}
      </li>
    ),

    strong: ({ children }: any) => (
      <strong className={`font-semibold ${textClass}`}>{children}</strong>
    ),

    em: ({ children }: any) => (
      <em className={`italic ${textClass}`}>{children}</em>
    ),

    h1: ({ children }: any) => (
      <h1 className={`text-base font-semibold ${textClass}`}>{children}</h1>
    ),

    h2: ({ children }: any) => (
      <h2 className={`text-base font-semibold ${textClass}`}>{children}</h2>
    ),

    h3: ({ children }: any) => (
      <h3 className={`text-sm font-semibold ${textClass}`}>{children}</h3>
    ),

    h4: ({ children }: any) => (
      <h4 className={`text-sm font-semibold ${textClass}`}>{children}</h4>
    ),

    blockquote: ({ children }: any) => (
      <blockquote
        className={`border-l-2 pl-3 italic ${subtleBorder} ${mutedTextClass}`}
      >
        {children}
      </blockquote>
    ),

    code: ({ children }: any) => (
      <code
        className={`rounded px-1 py-0.5 font-mono text-[0.85em] ${surfaceClass}`}
      >
        {children}
      </code>
    ),

    pre: ({ children }: any) => (
      <pre
        className={`my-2 overflow-x-auto rounded-lg p-3 text-xs ${surfaceClass}`}
      >
        {children}
      </pre>
    ),

    table: ({ children }: any) => (
      <div className={`my-2 overflow-x-auto rounded-lg border ${subtleBorder}`}>
        <table className="w-full border-collapse text-left text-sm">
          {children}
        </table>
      </div>
    ),

    th: ({ children }: any) => (
      <th
        className={`px-2 py-1.5 text-xs font-semibold ${surfaceClass} ${subtleBorder}`}
      >
        {children}
      </th>
    ),

    td: ({ children }: any) => (
      <td className={`px-2 py-1.5 align-top ${textClass} ${subtleBorder}`}>
        {children}
      </td>
    ),

    hr: () => <hr className={`my-3 border-t ${subtleBorder}`} />,
  } as any;
}

export default function SupportWidget({
  apiEndpoint = "/api/support",
  initialMessage = DEFAULT_INITIAL,
}: SupportWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom whenever a message appears or loading state changes.
  useEffect(() => {
    if (!isOpen) return;

    const el = scrollRef.current;
    if (!el) return;

    const timer = setTimeout(() => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }, 60);

    return () => clearTimeout(timer);
  }, [messages, isLoading, isOpen]);

  // Focus input when opening.
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();

    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    setIsLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          data.reply ??
          "Sorry, I didn't catch that. Could you please rephrase your question?",
      };

      setMessages((previous) => [...previous, assistantMessage]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Something went wrong. Please try again in a moment or use the [Contact page](/contact).",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, apiEndpoint]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);

    event.target.style.height = "auto";
    const nextHeight = Math.min(event.target.scrollHeight, 96);
    event.target.style.height = `${nextHeight}px`;
  };

  return (
    <div className="fixed bottom-5 right-5 z-[999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="mb-3 flex h-[520px] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
            role="dialog"
            aria-label="Support chat"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-primary/10 bg-primary px-4 py-3 text-primary-foreground">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/10">
                  <Bot className="h-4 w-4" />
                </span>

                <div className="leading-tight">
                  <p className="text-sm font-medium">{BRAND.name} Support</p>
                  <p className="flex items-center gap-1 text-xs text-primary-foreground/75">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Online
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close support chat"
                className="rounded-md p-1.5 text-primary-foreground/75 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto bg-background px-4 py-4"
            >
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 self-start rounded-xl border border-border/60 bg-muted px-3 py-2 text-muted-foreground">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background">
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span className="text-xs">typing…</span>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-end gap-2 border-t border-border bg-background p-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message…"
                rows={1}
                className="max-h-24 flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
                style={{ height: "auto" }}
              />

              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen((value) => !value)}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? "Close support chat" : "Open support chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

const MessageBubble = memo(function MessageBubble({
  message,
}: {
  message: ChatMessage;
}) {
  const isUser = message.role === "user";

  const markdownComponents = useMemo(
    () => createMarkdownComponents(isUser),
    [isUser],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : (
          <Bot className="h-3.5 w-3.5" />
        )}
      </span>

      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm border border-border/60 bg-muted text-foreground"
        }`}
      >
        <div className="space-y-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
});
