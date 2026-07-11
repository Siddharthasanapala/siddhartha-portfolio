"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { useChatWidget } from "@/components/chatbot/ChatWidgetProvider";

export function OpenChatButton() {
  const { open } = useChatWidget();

  return (
    <Button variant="primary" onClick={open} className="w-fit gap-2">
      <MessageCircle size={18} aria-hidden="true" />
      Chat with Sid&rsquo;s Assistant
    </Button>
  );
}
