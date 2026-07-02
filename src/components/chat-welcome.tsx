"use client";

import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { addMessage, startNewChat } from "@/lib/store/slices/chatSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, MessageCircle, Zap, Shield } from "lucide-react";
import type { ChatMessage } from "@/types/personas.types";
import {

  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";

export function ChatWelcome() {
  const dispatch = useAppDispatch();
  const { selectedPersonas, personalityTone } = useAppSelector(
    (state: { persona: any }) => state.persona
  );
  const { currentChatId, chatHistory } = useAppSelector(
    (state: { chat: any }) => state.chat
  );
  const { apiKey } = useAppSelector(
    (state: { settings: any }) => state.settings
  );
  const [loadingStarter, setLoadingStarter] = useState<string | null>(null);

  const suggestions = [
    "Tell me about your expertise",
    "What's your background?",
    "Can you help me with a project?",
    "What are your thoughts on current trends?",
  ];

  const handleSuggestionClick = async (suggestion: string) => {
    if (!apiKey) {
      console.error("No API key available");
      return;
    }

    setLoadingStarter(suggestion);

    try {
      // Start new chat if none exists
      let chatId = currentChatId;
      if (!chatId) {
        chatId = `chat-${Date.now()}`;
        dispatch(startNewChat(chatId));
      }

      // Add user message
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: suggestion,
        sender: "user",
        timestamp: new Date(),
      };

      dispatch(addMessage(userMessage));

      // Get conversation history for context
      const conversationHistory = chatHistory[chatId] || [];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: suggestion,
          personas: selectedPersonas,
          tone: personalityTone,
          apiKey,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Add AI response
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
      };

      dispatch(addMessage(aiMessage));
    } catch (error) {
      console.error("Error generating response:", error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        content:
          "Sorry, I encountered an error while processing your request. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };

      dispatch(addMessage(errorMessage));
    } finally {
      setLoadingStarter(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-serif text-foreground mb-2">
              Welcome to FFP CHAT
            </h1>
            <p className="text-lg text-muted-foreground">
              Start a conversation with your selected AI personas
            </p>
          </div>
        </div>

        {/* Active Personas */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-orange-500" />
              Active Personas ({selectedPersonas.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedPersonas.map(
                (persona: {
                  id: Key | null | undefined;
                  basic_information: {
                    avatar: any;
                    name:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>

                      | null
                      | undefined;
                    occupation:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal

                      | null
                      | undefined;
                  };
                  knowledge_base: { topics_of_expertise: any[] };
                }) => (
                  <div
                    key={persona.id}
                    className="flex items-start gap-3 p-4 bg-muted rounded-lg"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={
                          persona.basic_information.avatar || "/placeholder.svg"
                        }
                        alt={persona.basic_information.name as string}
                      />
                      <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">
                        {persona.basic_information.name}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">
                        {persona.basic_information.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {persona.basic_information.occupation}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {persona.knowledge_base.topics_of_expertise
                          .slice(0, 3)
                          .map((topic) => (
                            <Badge
                              key={topic}
                              variant="secondary"
                              className="text-xs"
                            >
                              {topic}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Conversation Tone</h3>
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                {personalityTone.charAt(0).toUpperCase() +
                  personalityTone.slice(1)}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Privacy</h3>
              <p className="text-sm text-muted-foreground">
                Local storage only
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Chat Mode</h3>
              <p className="text-sm text-muted-foreground">
                {selectedPersonas.length === 1
                  ? "Single Persona"
                  : "Multi Persona"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Conversation Starters */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Conversation Starters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors relative ${
                    loadingStarter === suggestion
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() =>
                    !loadingStarter && handleSuggestionClick(suggestion)
                  }
                >
                  <p className="text-sm text-foreground">{suggestion}</p>
                  {loadingStarter === suggestion && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
