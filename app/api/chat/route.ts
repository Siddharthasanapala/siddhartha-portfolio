import { NextRequest } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";
import { generateChatReply } from "@/lib/gemini";
import { CONTACT_RATE_LIMIT, checkRateLimit } from "@/lib/rateLimit";
import { sanitizeText } from "@/lib/sanitize";

const CHAT_RATE_LIMIT = { limit: 20, windowMs: 10 * 60 * 1000 };
const MAX_HISTORY = 40;

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(MAX_HISTORY),
});

const RATE_LIMIT_REPLY =
  "You're sending messages a little quickly — please slow down and try again in a few minutes.";
const DEGRADED_REPLY =
  "I'm briefly unavailable — please try again in a moment, or leave a message and Siddhartha will follow up by email.";
const CONTACT_SENT_REPLY = "Message sent — Siddhartha will get back to you by email.";
const CONTACT_FAILED_REPLY = "Something went wrong sending your message — want me to try again?";
const CONTACT_RATE_LIMITED_REPLY =
  "You've sent a few messages recently — please wait a bit before sending another.";

/**
 * Server-side only (chatbot spec §3): prepends the verbatim system prompt
 * with live RESUME_CONTEXT, calls Gemini at low temperature, and never
 * returns the API key, system prompt, or raw error details to the client.
 */
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rateLimit = checkRateLimit(`chat:${ip}`, CHAT_RATE_LIMIT);
  if (!rateLimit.allowed) {
    return Response.json({ reply: RATE_LIMIT_REPLY });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = parsed.data.messages.map((message) => ({
    role: message.role,
    content: sanitizeText(message.content),
  }));

  try {
    const result = await generateChatReply(messages);

    if (result.type === "text") {
      return Response.json({ reply: result.text });
    }

    // Calls sendContactEmail directly, in-process, rather than making a
    // server-to-server HTTP call to /api/contact — an earlier version did
    // that, but the internal fetch didn't (and, over plain HTTP, largely
    // can't cleanly) forward the visitor's real x-forwarded-for header, so
    // every chat-driven send fell into the same "unknown" IP rate-limit
    // bucket shared across all visitors. Reusing `ip` here (the real,
    // already-resolved visitor IP for *this* request) keeps the contact
    // rate limit correctly scoped per-visitor, same as the direct
    // ContactForm path.
    const contactRateLimit = checkRateLimit(`contact:${ip}`, CONTACT_RATE_LIMIT);
    if (!contactRateLimit.allowed) {
      return Response.json({ reply: CONTACT_RATE_LIMITED_REPLY });
    }

    const contactResult = await sendContactEmail({
      name: sanitizeText(result.args.name),
      email: result.args.email,
      organization: result.args.organization ? sanitizeText(result.args.organization) : undefined,
      message: sanitizeText(result.args.message),
    });

    if (!contactResult.success) {
      console.error("Contact email send failed (chat flow)", contactResult.error);
      return Response.json({ reply: CONTACT_FAILED_REPLY });
    }

    return Response.json({ reply: CONTACT_SENT_REPLY });
  } catch (error) {
    console.error("Chat request failed", error);
    return Response.json({ reply: DEGRADED_REPLY });
  }
}
