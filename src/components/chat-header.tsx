"use client";

import { useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Search, History, Bell, Copy } from "lucide-react";
import type { Persona } from "@/types/personas.types";

interface ChatHeaderProps {
  onMenuClick: () => void;
  selectedPersonas: Persona[];
}

export function ChatHeader({ onMenuClick, selectedPersonas }: ChatHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { messages } = useAppSelector((state) => state.chat);
  const { personalityTone } = useAppSelector((state) => state.persona);

  const getToneColor = (tone: string) => {
    switch (tone) {
      case "funny":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advice":
        return "bg-green-100 text-green-800 border-green-200";
      case "educational":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <header className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Active Personas */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {selectedPersonas.slice(0, 3).map((persona) => (
              <Avatar key={persona.id} className="w-8 h-8">
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
            ))}
            {selectedPersonas.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-medium">
                  +{selectedPersonas.length - 3}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate">
              {selectedPersonas.length === 1
                ? selectedPersonas[0].basic_information.name
                : `${selectedPersonas.length} AI Personas`}
            </h2>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={getToneColor(personalityTone)}
              >
                {personalityTone.charAt(0).toUpperCase() +
                  personalityTone.slice(1)}{" "}
                Tone
              </Badge>
              {selectedPersonas.length === 1 && (
                <span className="text-xs text-muted-foreground truncate">
                  {selectedPersonas[0].basic_information.occupation}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Copy className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">{messages.length}/50</span>
          </div>
        </div>
      </div>
    </header>
  );
}
