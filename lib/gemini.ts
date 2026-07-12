import { GoogleGenerativeAI, SchemaType, type Content, type GenerationConfig } from "@google/generative-ai";
import type { ChatTurn } from "@/types";
import { getResumeContext } from "./resumeContext";
import { buildSystemPrompt } from "./systemPrompt";

// The chatbot spec names gemini-1.5-flash/gemini-2.0-flash, but by the time
// of this deployment 1.5 is retired and 2.0 has zero free-tier quota for new
// projects. gemini-flash-lite-latest (Google's stable low-latency alias) was
// measured directly against this project's key at ~1s round-trip vs 6-15s
// for gemini-flash-latest — the "lite" variants skip the extended reasoning
// pass that a short, grounded lookup/refusal task like this doesn't need.
const MODEL_NAME = "gemini-flash-lite-latest";
const SEND_MESSAGE_FUNCTION = "send_message";

// thinkingConfig isn't in this SDK version's published types yet, but the
// REST API accepts it — confirmed directly (thoughtsTokenCount dropped from
// ~550 to 0 with thinkingBudget: 0, cutting real-world latency dramatically).
interface GenerationConfigWithThinking extends GenerationConfig {
  thinkingConfig?: { thinkingBudget: number };
}

const GENERATION_CONFIG: GenerationConfigWithThinking = {
  temperature: 0.3,
  maxOutputTokens: 400,
  thinkingConfig: { thinkingBudget: 0 },
};

export type ChatReplyResult =
  | { type: "text"; text: string }
  | {
      type: "functionCall";
      args: { name: string; email: string; organization?: string; message: string };
    };

// Rebuilt from /data/*.ts on every call rather than cached: a prior
// per-process cache meant updates to skills/experience/resume content never
// reached the chatbot until the server process itself restarted. Cost is
// negligible (JSON.stringify of a few KB of structured data).
function getSystemInstruction(): string {
  return buildSystemPrompt(getResumeContext());
}

/**
 * Calls Gemini with the verbatim system prompt (live RESUME_CONTEXT injected)
 * at low temperature (chatbot spec §3.3). Declares `send_message` as a tool
 * so the model can trigger the contact flow's backend action once the
 * visitor has confirmed (chatbot spec §2 CONTACT FLOW step 5) instead of
 * us having to parse its prose for intent.
 */
export async function generateChatReply(messages: ChatTurn[]): Promise<ChatReplyResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: getSystemInstruction(),
    generationConfig: GENERATION_CONFIG,
    tools: [
      {
        functionDeclarations: [
          {
            name: SEND_MESSAGE_FUNCTION,
            description:
              "Send a visitor's confirmed professional message/request to Siddhartha by email. Only call this after the visitor has explicitly confirmed the summary.",
            parameters: {
              type: SchemaType.OBJECT,
              properties: {
                name: { type: SchemaType.STRING, description: "Visitor's name" },
                email: { type: SchemaType.STRING, description: "Visitor's email address" },
                organization: {
                  type: SchemaType.STRING,
                  description: "Visitor's organization or context, if provided",
                },
                message: {
                  type: SchemaType.STRING,
                  description: "The visitor's message or request",
                },
              },
              required: ["name", "email", "message"],
            },
          },
        ],
      },
    ],
  });

  const contents: Content[] = messages.map((turn) => ({
    role: turn.role === "assistant" ? "model" : "user",
    parts: [{ text: turn.content }],
  }));

  const result = await model.generateContent({ contents });
  const { response } = result;

  const calls = response.functionCalls();
  const sendMessageCall = calls?.find((call) => call.name === SEND_MESSAGE_FUNCTION);

  if (sendMessageCall) {
    const args = sendMessageCall.args as {
      name: string;
      email: string;
      organization?: string;
      message: string;
    };
    return { type: "functionCall", args };
  }

  return { type: "text", text: response.text() };
}
