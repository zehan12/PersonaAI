"use client";

import type React from "react";

import { useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { resetPersonaState } from "@/lib/store/slices/personaSlice";
import { clearApiKey } from "@/lib/store/slices/settingsSlice";
import {
  clearAllHistory,
  startNewChat,
  loadChat,
  deleteChat,
} from "@/lib/store/slices/chatSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Plus, MessageSquare, Trash2, LogOut, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ChatSidebarProps {
  onClose: () => void;
}

export function ChatSidebar({ onClose }: ChatSidebarProps) {
  const dispatch = useAppDispatch();
  const { selectedPersonas } = useAppSelector((state) => state.persona);
  const { chatHistory, currentChatId } = useAppSelector((state) => state.chat);

  const sortedChatIds = useMemo(() => {
    return Object.keys(chatHistory).sort((a, b) => {
      const aMessages = chatHistory[a];
      const bMessages = chatHistory[b];
      const aTime =
        aMessages.length > 0
          ? new Date(aMessages[aMessages.length - 1].timestamp).getTime()
          : 0;
      const bTime =
        bMessages.length > 0
          ? new Date(bMessages[bMessages.length - 1].timestamp).getTime()
          : 0;
      return bTime - aTime;
    });
  }, [chatHistory]);

  const handleNewChat = () => {
    const chatId = `chat-${Date.now()}`;
    dispatch(startNewChat(chatId));
    onClose();
  };

  const handleLoadChat = (chatId: string) => {
    dispatch(loadChat(chatId));
    onClose();
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteChat(chatId));
  };

  const handleClearAllHistory = () => {
    dispatch(clearAllHistory());
  };

  const handleLogout = () => {
    dispatch(resetPersonaState());
    dispatch(clearApiKey());
  };

  return (
    <div className="h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold font-serif text-sidebar-foreground">
                FFP CHAT
              </h1>
              <p className="text-xs text-sidebar-foreground/60">
                Free Forever Chat
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Selected Personas */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-sidebar-foreground/80 uppercase tracking-wide">
            Active Personas
          </p>
          <div className="space-y-1 sm:space-y-2">
            {selectedPersonas.map((persona) => (
              <div
                key={persona.id}
                className="flex items-center gap-2 p-2 bg-sidebar-accent rounded-lg"
              >
                <Avatar className="w-5 h-5 sm:w-6 sm:h-6">
                  <AvatarImage
                    src={persona.basic_information.avatar || "/placeholder.svg"}
                    alt={persona.basic_information.name}
                  />
                  <AvatarFallback className="text-xs bg-orange-100 text-orange-600">
                    {persona.basic_information.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs sm:text-sm text-sidebar-foreground truncate">
                  {persona.basic_information.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3 sm:p-4">
        <Button
          onClick={handleNewChat}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 px-3 sm:px-4 min-h-0">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-sidebar-foreground/80 uppercase tracking-wide">
            Chat History
          </p>
          {sortedChatIds.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sidebar-foreground/60 hover:text-sidebar-foreground h-6 w-6 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Chat History</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your chat history. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllHistory}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <ScrollArea className="h-full">
          <div className="space-y-1">
            {sortedChatIds.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-sidebar-foreground/40 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-sidebar-foreground/60">
                  No chat history yet
                </p>
                <p className="text-xs text-sidebar-foreground/40">
                  Start a new conversation
                </p>
              </div>
            ) : (
              sortedChatIds.map((chatId) => {
                const messages = chatHistory[chatId];
                const lastMessage = messages[messages.length - 1];
                const isActive = currentChatId === chatId;

                return (
                  <div
                    key={chatId}
                    className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "hover:bg-sidebar-accent text-sidebar-foreground"
                    }`}
                    onClick={() => handleLoadChat(chatId)}
                  >
                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm truncate">
                        {lastMessage?.content.slice(0, 25) || "New Chat"}
                        {lastMessage?.content.length > 25 && "..."}
                      </p>
                      <p className="text-xs opacity-60">
                        {messages.length} message
                        {messages.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteChat(chatId, e)}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto w-auto ${
                        isActive
                          ? "text-sidebar-primary-foreground hover:bg-sidebar-primary/80"
                          : "hover:bg-destructive hover:text-destructive-foreground"
                      }`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-sidebar-border space-y-3 sm:space-y-4">
        {/* Actions */}
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Reset Setup
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Setup</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear your persona selection and API key, returning
                  you to the setup screen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
