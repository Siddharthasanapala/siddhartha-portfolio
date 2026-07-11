"use client";

import { useState } from "react";
import { useChatWidget } from "./ChatWidgetProvider";

/**
 * Gemini-independent "leave a message" fallback (chatbot spec §7.4: the
 * contact-flow fallback must work even when Gemini is unavailable). Posts
 * straight to /api/contact — same validation/rate-limit/honeypot as the
 * AI-driven flow, just without an LLM in the loop.
 */
export function ContactForm() {
  const { setMode, submitContactForm } = useChatWidget();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim() || status === "sending") return;

    setStatus("sending");
    const success = await submitContactForm({
      name: name.trim(),
      email: email.trim(),
      organization: organization.trim() || undefined,
      message: message.trim(),
      website,
    });

    if (success) {
      setName("");
      setEmail("");
      setOrganization("");
      setMessage("");
      setStatus("idle");
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <span className="text-body text-text-muted">Leave a message for Siddhartha directly.</span>
        <button
          type="button"
          onClick={() => setMode("chat")}
          className="font-mono text-xs text-text-muted hover:text-text"
        >
          Back to chat
        </button>
      </div>

      {/* Honeypot — hidden from real visitors, left blank by them. */}
      <input
        type="text"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px]"
      />

      <input
        type="text"
        required
        placeholder="Your name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="rounded-lg border border-border bg-bg px-3 py-2 text-body text-text placeholder:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      />
      <input
        type="email"
        required
        placeholder="Your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="rounded-lg border border-border bg-bg px-3 py-2 text-body text-text placeholder:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      />
      <input
        type="text"
        placeholder="Organization (optional)"
        value={organization}
        onChange={(event) => setOrganization(event.target.value)}
        className="rounded-lg border border-border bg-bg px-3 py-2 text-body text-text placeholder:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      />
      <textarea
        required
        rows={4}
        placeholder="Your message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        maxLength={2000}
        className="resize-none rounded-lg border border-border bg-bg px-3 py-2 text-body text-text placeholder:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      />

      {status === "error" && (
        <p className="text-body text-accent-warn">
          Could not send your message. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-accent px-4 py-2 font-body text-sm font-medium text-on-accent transition disabled:opacity-50 motion-safe:hover:scale-[1.02]"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
