"use client";

import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  updateMessageReaction,
  setRegeneratingMessage,
  replaceMessage,
} from "@/lib/store/slices/chatSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "@/types/personas.types";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const dispatch = useAppDispatch();
  const { selectedPersonas, personalityTone } = useAppSelector(
    (state) => state.persona
  );
  const { regeneratingMessageId } = useAppSelector((state) => state.chat);
  const { apiKey } = useAppSelector((state) => state.settings);
  const { toast } = useToast();

  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    }
  };

  const handleReaction = (messageId: string, reaction: "like" | "dislike") => {
    const currentMessage = messages.find((msg) => msg.id === messageId);
    const newReaction = currentMessage?.reaction === reaction ? null : reaction;

    dispatch(updateMessageReaction({ messageId, reaction: newReaction }));

    if (newReaction) {
      toast({
        title: newReaction === "like" ? "👍 Liked" : "👎 Disliked",
        description: `You ${newReaction}d this message`,
      });
    } else {
      toast({
        title: "Reaction removed",
        description: "Your reaction has been removed",
      });
    }
  };

  const handleRegenerate = async (messageId: string) => {
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    const previousMessage = messages[messageIndex - 1];
    if (previousMessage.sender !== "user") return;

    dispatch(setRegeneratingMessage(messageId));

    try {
      const conversationHistory = messages.slice(0, messageIndex - 1);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: previousMessage.content,
          personas: selectedPersonas,
          tone: personalityTone,
          apiKey,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to regenerate response");
      }

      const data = await response.json();

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
        personaId: selectedPersonas[0]?.id,
      };

      dispatch(replaceMessage({ oldMessageId: messageId, newMessage }));

      toast({
        title: "Regenerated!",
        description: "New response generated successfully",
      });
    } catch (error) {
      console.error("Error regenerating message:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      dispatch(setRegeneratingMessage(null));
    }
  };

  const getPersonaForMessage = (message: ChatMessage) => {
    if (message.personaId) {
      return selectedPersonas.find((p) => p.id === message.personaId);
    }
    return selectedPersonas[0]; // Default to first persona
  };

  return (
    <div className="space-y-6 p-6">
      {messages.map((message) => (
        <div key={message.id} className="space-y-4">
          {message.sender === "user" ? (
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-orange-500 text-white rounded-2xl rounded-br-md px-4 py-3">
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.imageUrl && (
                  <img
                    src={message.imageUrl || "/placeholder.svg"}
                    alt="User uploaded"
                    className="mt-2 rounded-lg max-w-full h-auto"
                  />
                )}
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                {selectedPersonas.length === 1 ? (
                  <>
                    <AvatarImage
                      src={
                        selectedPersonas[0].basic_information.avatar ||
                        "/placeholder.svg"
                      }
                      alt={selectedPersonas[0].basic_information.name}
                    />
                    <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">
                      {selectedPersonas[0].basic_information.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/placeholder.svg" alt="AI" />
                    <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">
                      AI
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className="flex-1 space-y-2">
                <Card>
                  <CardContent className="p-4">
                    {selectedPersonas.length === 1 && (
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {selectedPersonas[0].basic_information.name}
                        </Badge>
                      </div>
                    )}
                    <div className="text-sm text-foreground whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </CardContent>
                </Card>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyMessage(message.content)}
                    className="h-8 px-2"
                    title="Copy message"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-2 transition-colors ${
                      message.reaction === "like"
                        ? "text-green-600 bg-green-50 hover:bg-green-100"
                        : "hover:text-green-600"
                    }`}
                    title="Like"
                    onClick={() => handleReaction(message.id, "like")}
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-2 transition-colors ${
                      message.reaction === "dislike"
                        ? "text-red-600 bg-red-50 hover:bg-red-100"
                        : "hover:text-red-600"
                    }`}
                    title="Dislike"
                    onClick={() => handleReaction(message.id, "dislike")}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    title="Regenerate"
                    onClick={() => handleRegenerate(message.id)}
                    disabled={regeneratingMessageId === message.id}
                  >
                    <RotateCcw
                      className={`w-3 h-3 ${
                        regeneratingMessageId === message.id
                          ? "animate-spin"
                          : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            {selectedPersonas.length === 1 ? (
              <>
                <AvatarImage
                  src={
                    selectedPersonas[0].basic_information.avatar ||
                    "/placeholder.svg"
                  }
                  alt={selectedPersonas[0].basic_information.name}
                />
                <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">
                  {selectedPersonas[0].basic_information.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </>
            ) : (
              <>
                <AvatarImage src="/placeholder.svg" alt="AI" />
                <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">
                  AI
                </AvatarFallback>
              </>
            )}
          </Avatar>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {selectedPersonas.length === 1
                    ? `${selectedPersonas[0].basic_information.name} is thinking...`
                    : "AI personas are thinking..."}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
