"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import type { ChatTurn, ContactPayload } from "@/types";

const OPENING_MESSAGE: ChatTurn = {
  role: "assistant",
  content:
    "Hi! I'm Sid's assistant. Ask me about his experience, skills, or projects — or let me pass along a message to him.",
};

const DEGRADED_REPLY_FALLBACK =
  "I'm briefly unavailable — please try again in a moment, or leave a message and Siddhartha will follow up by email.";

type ChatMode = "chat" | "contactForm";

interface ChatWidgetContextValue {
  isOpen: boolean;
  hasOpenedOnce: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  launcherRef: MutableRefObject<HTMLButtonElement | null>;

  mode: ChatMode;
  setMode: (mode: ChatMode) => void;

  messages: ChatTurn[];
  isLoading: boolean;
  showQuickReplies: boolean;
  sendMessage: (text: string) => Promise<void>;

  /**
   * Direct, Gemini-independent path to /api/contact — the "contact-flow
   * fallback (which does not depend on Gemini)" required by chatbot spec §7.4.
   */
  submitContactForm: (payload: ContactPayload & { website: string }) => Promise<boolean>;
}

const ChatWidgetContext = createContext<ChatWidgetContextValue | undefined>(undefined);

/**
 * Owns both the open/closed UI state and the conversation itself, so the
 * conversation persists across closing/reopening the panel within the same
 * session (chatbot spec §4) — only a full page reload clears it.
 */
export function ChatWidgetProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [mode, setMode] = useState<ChatMode>("chat");
  const launcherRef = useRef<HTMLButtonElement | null>(null);

  const [messages, setMessages] = useState<ChatTurn[]>([OPENING_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const open = useCallback(() => {
    setHasOpenedOnce(true);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    launcherRef.current?.focus();
  }, []);

  const toggle = useCallback(() => {
    setHasOpenedOnce(true);
    setIsOpen((current) => !current);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setShowQuickReplies(false);
      const nextMessages: ChatTurn[] = [...messages, { role: "user", content: trimmed }];
      setMessages(nextMessages);
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages }),
        });
        const data: { reply?: string } = await res.json();
        const reply = data.reply ?? "Something went wrong. Please try again.";
        setMessages((current) => [...current, { role: "assistant", content: reply }]);
      } catch {
        setMessages((current) => [...current, { role: "assistant", content: DEGRADED_REPLY_FALLBACK }]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading],
  );

  const submitContactForm = useCallback(
    async (payload: ContactPayload & { website: string }): Promise<boolean> => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data: { success?: boolean } = await res.json();

        if (data.success) {
          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content: "Message sent — Siddhartha will get back to you by email.",
            },
          ]);
          setMode("chat");
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      isOpen,
      hasOpenedOnce,
      open,
      close,
      toggle,
      launcherRef,
      mode,
      setMode,
      messages,
      isLoading,
      showQuickReplies,
      sendMessage,
      submitContactForm,
    }),
    [isOpen, hasOpenedOnce, open, close, toggle, mode, messages, isLoading, showQuickReplies, sendMessage, submitContactForm],
  );

  return <ChatWidgetContext.Provider value={value}>{children}</ChatWidgetContext.Provider>;
}

export function useChatWidget(): ChatWidgetContextValue {
  const ctx = useContext(ChatWidgetContext);
  if (!ctx) {
    throw new Error("useChatWidget must be used within a ChatWidgetProvider");
  }
  return ctx;
}
