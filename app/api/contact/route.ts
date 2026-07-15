import { z } from "zod";
import { sendContactEmail } from "@/lib/email";
import { CONTACT_RATE_LIMIT, checkRateLimit } from "@/lib/rateLimit";
import { sanitizeText } from "@/lib/sanitize";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email(),
  organization: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
  // Honeypot: real visitors never fill this in.
  website: z.string().optional().or(z.literal("")),
});

/**
 * The direct "leave a message" path (chatbot spec §5) — used by ContactForm's
 * standalone submission. The AI-driven chat flow calls sendContactEmail
 * directly in-process instead of hitting this route over HTTP (see
 * app/api/chat/route.ts) — an earlier version proxied through here via a
 * server-to-server fetch, which silently dropped the visitor's real IP and
 * caused every chat-driven send to share one rate-limit bucket.
 */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rateLimit = checkRateLimit(`contact:${ip}`, CONTACT_RATE_LIMIT);
  if (!rateLimit.allowed) {
    return Response.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot tripped — pretend success so bots don't learn to avoid the field.
  if (parsed.data.website) {
    return Response.json({ success: true });
  }

  const result = await sendContactEmail({
    name: sanitizeText(parsed.data.name),
    email: parsed.data.email,
    organization: parsed.data.organization ? sanitizeText(parsed.data.organization) : undefined,
    message: sanitizeText(parsed.data.message),
  });

  if (!result.success) {
    console.error("Contact email send failed", result.error);
    return Response.json(
      { success: false, error: "Could not send your message. Please try again." },
      { status: 502 },
    );
  }

  return Response.json({ success: true });
}
