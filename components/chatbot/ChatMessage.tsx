import type { ReactNode } from "react";
import type { ChatTurn } from "@/types";

/** Renders **bold** spans within a single line of text. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((part) => part.length > 0);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={`${keyPrefix}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`${keyPrefix}-${index}`}>{part}</span>;
  });
}

/**
 * Minimal markdown rendering for chat replies — Gemini's responses use
 * **bold** and "* "/"1. " list markers (per chatbot spec §2 FORMATTING,
 * which allows bullet lists), which were previously shown as raw asterisks
 * instead of being formatted.
 */
function renderContent(content: string): ReactNode[] {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;

  function flushList(key: string) {
    if (listItems.length === 0) return;
    const ListTag = listType === "ol" ? "ol" : "ul";
    blocks.push(
      <ListTag key={key} className={listType === "ol" ? "list-decimal pl-5" : "list-disc pl-5"}>
        {listItems.map((item, index) => (
          <li key={index}>{renderInline(item, `${key}-li-${index}`)}</li>
        ))}
      </ListTag>,
    );
    listItems = [];
    listType = null;
  }

  lines.forEach((line, index) => {
    const bulletMatch = line.match(/^\s*[*-]\s+(.*)/);
    const orderedMatch = line.match(/^\s*\d+[.)]\s+(.*)/);

    if (bulletMatch) {
      if (listType === "ol") flushList(`list-${index}`);
      listType = "ul";
      listItems.push(bulletMatch[1]);
    } else if (orderedMatch) {
      if (listType === "ul") flushList(`list-${index}`);
      listType = "ol";
      listItems.push(orderedMatch[1]);
    } else {
      flushList(`list-${index}`);
      if (line.trim().length > 0) {
        blocks.push(<p key={`p-${index}`}>{renderInline(line, `p-${index}`)}</p>);
      }
    }
  });
  flushList("list-final");

  return blocks;
}

export function ChatMessage({ role, content }: ChatTurn) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] space-y-1.5 rounded-xl px-3.5 py-2.5 text-body ${
          isUser ? "bg-accent text-on-accent" : "border border-border bg-bg-elevated-2 text-text"
        }`}
      >
        {renderContent(content)}
      </div>
    </div>
  );
}
