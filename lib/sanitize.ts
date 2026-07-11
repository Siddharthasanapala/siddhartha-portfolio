const MAX_MESSAGE_LENGTH = 2000;

/** Strips HTML/script-like tags and trims/truncates before the text reaches the model or storage (chatbot spec §3.4). */
export function sanitizeText(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim().slice(0, MAX_MESSAGE_LENGTH);
}
