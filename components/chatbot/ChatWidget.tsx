"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Send, X } from "lucide-react";
import { useChatWidget } from "./ChatWidgetProvider";
import { ChatMessage } from "./ChatMessage";
import { ContactForm } from "./ContactForm";

const QUICK_REPLIES = [
  "What does he specialize in?",
  "Show me his recent projects",
  "I'd like to get in touch",
];

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ChatWidget() {
  const { isOpen, close, mode, setMode, messages, isLoading, showQuickReplies, sendMessage } =
    useChatWidget();
  const shouldReduceMotion = useReducedMotion();
  const [input, setInput] = useState("");
  const panelRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Esc-to-close + a focus trap while the panel is open (chatbot spec §4).
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }, [messages, isLoading, shouldReduceMotion, mode]);

  function handleSend(text: string) {
    setInput("");
    void sendMessage(text);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          id="chat-widget-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Chat with Sid's Assistant"
          tabIndex={-1}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.25 }}
          style={{ transformOrigin: "bottom right" }}
          className="fixed inset-x-3 top-16 bottom-3 z-[60] flex flex-col overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-2xl outline-none sm:inset-x-auto sm:inset-y-auto sm:bottom-24 sm:right-5 sm:top-auto sm:h-[560px] sm:w-[380px]"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-display text-h3 font-bold text-text">Sid&rsquo;s Assistant</span>
            <button
              type="button"
              onClick={close}
              aria-label="Close chat"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {mode === "contactForm" ? (
            <ContactForm />
          ) : (
            <>
              <div
                ref={scrollRef}
                className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
                aria-live="polite"
                aria-relevant="additions"
              >
                {messages.map((message, index) => (
                  <ChatMessage key={index} role={message.role} content={message.content} />
                ))}

                {isLoading && (
                  <div className="flex justify-start" aria-label="Sid's Assistant is typing">
                    <div className="flex items-center gap-1 rounded-xl border border-border bg-bg-elevated-2 px-3.5 py-2.5">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-text-muted" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-text-muted [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-text-muted [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
              </div>

              {showQuickReplies && (
                <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => handleSend(reply)}
                      className="rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-text-muted hover:text-text"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSend(input);
                }}
                className="flex items-center gap-2 border-t border-border p-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about his experience, skills, or projects…"
                  aria-label="Message"
                  maxLength={2000}
                  className="flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-body text-text placeholder:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-on-accent disabled:opacity-50"
                >
                  <Send size={16} aria-hidden="true" />
                </button>
              </form>

              {/* Gemini-independent fallback (chatbot spec §7.4) — always available, not just on failure. */}
              <button
                type="button"
                onClick={() => setMode("contactForm")}
                className="border-t border-border px-4 py-2 text-center font-mono text-xs text-text-muted hover:text-text"
              >
                Prefer to leave a message directly?
              </button>
            </>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
}
