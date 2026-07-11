"use client";

import { MessageCircle, X } from "lucide-react";
import { useChatWidget } from "./ChatWidgetProvider";

/**
 * Floating launcher, bottom-right at all breakpoints (chatbot spec §4).
 * Pulses subtly to draw attention while idle, stopping after first open
 * (Build Spec §5) — motion-safe only, so it's inert under reduced motion.
 */
export function ChatLauncher() {
  const { isOpen, hasOpenedOnce, toggle, launcherRef } = useChatWidget();
  const shouldPulse = !hasOpenedOnce && !isOpen;

  return (
    <button
      ref={launcherRef}
      type="button"
      onClick={toggle}
      aria-label={isOpen ? "Close chat" : "Open chat with Sid's Assistant"}
      aria-expanded={isOpen}
      aria-controls="chat-widget-panel"
      className={`fixed bottom-5 right-5 z-[60] h-14 w-14 items-center justify-center rounded-full bg-accent text-on-accent shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        // On mobile the panel is a near-fullscreen sheet spanning this
        // corner, so the launcher would sit on top of the panel's own
        // content — hide it there and rely on the panel's header close
        // button/Esc. Desktop's fixed 380x560 panel sits well clear of it.
        isOpen ? "hidden sm:flex" : "flex"
      } ${shouldPulse ? "motion-safe:animate-pulse" : ""}`}
    >
      {isOpen ? <X size={24} aria-hidden="true" /> : <MessageCircle size={24} aria-hidden="true" />}
    </button>
  );
}
