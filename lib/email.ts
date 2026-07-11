import { Resend } from "resend";
import type { ContactPayload } from "@/types";

export type SendContactEmailResult = { success: true } | { success: false; error: string };

/**
 * Server-only email sender (chatbot spec §5). Uses Resend's shared sandbox
 * sender by default — swap `from` for a verified domain address once one
 * exists, per 04-DOCKER_DEPLOYMENT.md §4 (RESEND_API_KEY, CONTACT_EMAIL are
 * runtime-only env vars, never baked into the image).
 */
export async function sendContactEmail(payload: ContactPayload): Promise<SendContactEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !contactEmail) {
    return { success: false, error: "Email delivery is not configured." };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: contactEmail,
    replyTo: payload.email,
    subject: `New portfolio message from ${payload.name}`,
    text: [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.organization ? `Organization: ${payload.organization}` : null,
      "",
      payload.message,
    ]
      .filter((line): line is string => line !== null)
      .join("\n"),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
