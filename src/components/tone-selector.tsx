"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, Heart, GraduationCap, MessageCircle } from "lucide-react";
import type { PersonalityTone } from "@/types/personas.types";

interface ToneSelectorProps {
  selectedTone: PersonalityTone;
  onToneSelect: (tone: PersonalityTone) => void;
}

const tones = [
  {
    id: "default" as PersonalityTone,
    name: "Default",
    description: "Natural, balanced conversation style",
    icon: MessageCircle,
    color: "bg-blue-100 text-blue-600 border-blue-200",
    selectedColor: "ring-blue-500 bg-blue-50 border-blue-200",
  },
  {
    id: "funny" as PersonalityTone,
    name: "Funny",
    description: "Humorous, playful, and entertaining responses",
    icon: Smile,
    color: "bg-yellow-100 text-yellow-600 border-yellow-200",
    selectedColor: "ring-yellow-500 bg-yellow-50 border-yellow-200",
  },
  {
    id: "advice" as PersonalityTone,
    name: "Advice",
    description: "Supportive, mentorship-oriented guidance",
    icon: Heart,
    color: "bg-green-100 text-green-600 border-green-200",
    selectedColor: "ring-green-500 bg-green-50 border-green-200",
  },
  {
    id: "educational" as PersonalityTone,
    name: "Educational",
    description: "Detailed, explanatory, and teaching-focused",
    icon: GraduationCap,
    color: "bg-purple-100 text-purple-600 border-purple-200",
    selectedColor: "ring-purple-500 bg-purple-50 border-purple-200",
  },
];

export function ToneSelector({
  selectedTone,
  onToneSelect,
}: ToneSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {tones.map((tone) => {
        const Icon = tone.icon;
        const isSelected = selectedTone === tone.id;

        return (
          <Card
            key={tone.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              isSelected
                ? `ring-2 ${tone.selectedColor}`
                : "hover:border-orange-200"
            }`}
            onClick={() => onToneSelect(tone.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${tone.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">
                      {tone.name}
                    </h3>
                    {isSelected && (
                      <Badge className="bg-orange-500 text-white text-xs">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tone.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
