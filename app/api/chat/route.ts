import { NextRequest } from "next/server";
import { z } from "zod";
import { generateChatReply } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rateLimit";
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

    const contactResponse = await fetch(new URL("/api/contact", request.nextUrl.origin), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: result.args.name,
        email: result.args.email,
        organization: result.args.organization ?? "",
        message: result.args.message,
        website: "",
      }),
    });

    if (contactResponse.ok) {
      return Response.json({ reply: CONTACT_SENT_REPLY });
    }

    return Response.json({ reply: CONTACT_FAILED_REPLY });
  } catch (error) {
    console.error("Chat request failed", error);
    return Response.json({ reply: DEGRADED_REPLY });
  }
}
