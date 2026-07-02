"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  addMessage,
  setLoading,
  startNewChat,
} from "@/lib/store/slices/chatSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, ImageIcon, Smile, AlertCircle } from "lucide-react";
import type { ChatMessage } from "@/types/personas.types";

interface ChatForm {
  message: string;
}

export function ChatInput() {
  const dispatch = useAppDispatch();
  const { isLoading, currentChatId, messages } = useAppSelector(
    (state) => state.chat
  );
  const { selectedPersonas, personalityTone } = useAppSelector(
    (state) => state.persona
  );
  const { apiKey, temperature } = useAppSelector((state) => state.settings);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue } = useForm<ChatForm>({
    defaultValues: { message: "" },
  });

  const onSubmit = async (data: ChatForm) => {
    const messageText = data.message || inputValue || "";
    if (!messageText.trim() && !imageFile) return;

    setError(null);

    // Start new chat if none exists
    if (!currentChatId) {
      const chatId = `chat-${Date.now()}`;
      dispatch(startNewChat(chatId));
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: messageText.trim(),
      sender: "user",
      timestamp: new Date(),
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
    };

    dispatch(addMessage(userMessage));
    reset();
    setInputValue("");
    setImageFile(null);

    // Set loading state
    dispatch(setLoading(true));

    try {
      const conversationHistory = messages.map((msg) => ({
        ...msg,
        role: msg.sender === "user" ? "user" : "assistant",
      }));

      // Call API with conversation history
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText.trim(),
          personas: selectedPersonas,
          apiKey,
          personalityTone,
          temperature,
          conversationHistory, // Added conversation history
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to get AI response");
      }

      // Add AI response
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: result.response,
        sender: "ai",
        timestamp: new Date(),
      };

      dispatch(addMessage(aiMessage));
    } catch (error) {
      console.error("Chat error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to send message"
      );

      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: `Sorry, I encountered an error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        sender: "ai",
        timestamp: new Date(),
      };
      dispatch(addMessage(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setValue("message", value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const isButtonDisabled = (!inputValue.trim() && !imageFile) || isLoading;

  return (
    <div className="border-t border-border bg-card p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Image Preview */}
        {imageFile && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <img
              src={URL.createObjectURL(imageFile) || "/placeholder.svg"}
              alt="Upload preview"
              className="w-12 h-12 object-cover rounded"
            />
            <span className="text-sm text-foreground flex-1">
              {imageFile.name}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setImageFile(null)}
            >
              Remove
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              {...register("message")}
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Start typing your message..."
              className="min-h-[60px] max-h-32 resize-none pr-12"
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 w-8 p-0"
                disabled={isLoading}
                title="Upload image"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={isLoading}
                title="Add emoji"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isButtonDisabled}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Your data stays local and private</span>
        </div>
      </form>
    </div>
  );
}
