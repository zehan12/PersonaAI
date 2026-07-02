"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "@/hooks/redux";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";
import { ChatWelcome } from "@/components/chat-welcome";

export function ChatMain() {
  const { messages, isLoading } = useAppSelector((state) => state.chat);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <ChatWelcome />
        ) : (
          <div className="h-full overflow-y-auto">
            <ChatMessages messages={messages} isLoading={isLoading} />
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <ChatInput />
    </div>
  );
}
