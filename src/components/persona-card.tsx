"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import type { Persona } from "@/types/personas.types";

interface PersonaCardProps {
  persona: Persona;
  isSelected: boolean;
  onToggle: () => void;
}

export function PersonaCard({
  persona,
  isSelected,
  onToggle,
}: PersonaCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "ring-2 ring-orange-500 bg-orange-50 border-orange-200"
          : "hover:border-orange-200"
      }`}
      onClick={onToggle}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={persona.basic_information.avatar || "/placeholder.svg"}
                alt={persona.basic_information.name}
              />
              <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">
                {persona.basic_information.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {persona.basic_information.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2 truncate">
              {persona.basic_information.occupation}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {persona.biography.bio_short}
            </p>

            <div className="flex flex-wrap gap-1">
              {persona.knowledge_base.topics_of_expertise
                .slice(0, 3)
                .map((topic) => (
                  <Badge
                    key={topic}
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-600"
                  >
                    {topic}
                  </Badge>
                ))}
              {persona.knowledge_base.topics_of_expertise.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-600"
                >
                  +{persona.knowledge_base.topics_of_expertise.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
