"use client";

import {
  useState,
  useMemo,
  lazy,
  Suspense,

  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  setSelectedPersonas,
  setPersonalityTone,
  setPersonaSetupComplete,
  setSearchQuery,
  setSelectedCategory,
} from "@/lib/store/slices/personaSlice";
import { setApiKey } from "@/lib/store/slices/settingsSlice";
import { personas, categories } from "@/lib/data/personas";
import { PersonaCard } from "@/components/persona-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Search, Sparkles, Twitter } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import type { PersonalityTone } from "@/types/personas.types";

const ToneSelector = lazy(() =>
  import("@/components/tone-selector").then((module) => ({
    default: module.ToneSelector,
  }))
);
const ApiKeySetup = lazy(() =>
  import("@/components/api-key-setup").then((module) => ({
    default: module.ApiKeySetup,
  }))
);

export function PersonaSetup() {
  const dispatch = useAppDispatch();
  const { selectedPersonas, personalityTone, searchQuery, selectedCategory } =
    useAppSelector((state: { persona: any }) => state.persona);
  const { apiKey } = useAppSelector(
    (state: { settings: any }) => state.settings
  );

  const [step, setStep] = useState<"persona" | "tone" | "apikey">("persona");

  const filteredPersonas = useMemo(() => {
    let filtered = personas;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((persona) =>
        persona.categories.includes(selectedCategory)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (persona) =>
          persona.basic_information.name.toLowerCase().includes(query) ||
          persona.basic_information.occupation.toLowerCase().includes(query) ||
          persona.knowledge_base.topics_of_expertise.some((topic) =>
            topic.toLowerCase().includes(query)
          )
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const selectedPersonasMap = useMemo(() => {
    return new Set(selectedPersonas.map((p: { id: any }) => p.id));
  }, [selectedPersonas]);

  const handlePersonaToggle = (persona: (typeof personas)[0]) => {
    const isSelected = selectedPersonasMap.has(persona.id);
    if (isSelected) {
      dispatch(
        setSelectedPersonas(
          selectedPersonas.filter((p: { id: string }) => p.id !== persona.id)
        )
      );
    } else {
      dispatch(setSelectedPersonas([...selectedPersonas, persona]));
    }
  };

  const handleToneSelect = (tone: PersonalityTone) => {
    dispatch(setPersonalityTone(tone));
  };

  const handleApiKeySubmit = (key: string) => {
    dispatch(setApiKey(key));
  };

  const handleComplete = () => {
    dispatch(setPersonaSetupComplete(true));
  };

  const canProceedFromPersona = selectedPersonas.length > 0;
  const canProceedFromTone = personalityTone !== "default" || true; // Allow default tone
  const canProceedFromApiKey = apiKey.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between  px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-foreground">
                FFP CHAT
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Free Forever Chat - Personal AI with Custom Personas
              </p>
            </div>
          </div>
          {/* Social Links */}
          <div className="flex gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-sidebar-foreground/60 hover:text-orange-500 h-8 w-8 p-0"
            >
              <a
                href="https://github.com/BCAPATHSHALA/PersonaAI"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-sidebar-foreground/60 hover:text-orange-500 h-8 w-8 p-0"
            >
              <a
                href="https://x.com/manojofficialmj"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-sidebar-foreground/60 hover:text-orange-500 h-8 w-8 p-0"
            >
              <a
                href="https://linkedin.com/in/manojofficialmj"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
        {/* Progress Steps - Made responsive */}
        <div className="flex items-center justify-center mb-6 sm:mb-8 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-4 min-w-max px-4">
            <div
              className={`flex items-center gap-1 sm:gap-2 ${
                step === "persona"
                  ? "text-orange-500"
                  : selectedPersonas.length > 0
                  ? "text-green-500"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                  step === "persona"
                    ? "bg-orange-500 text-white"
                    : selectedPersonas.length > 0
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <span className="font-medium text-sm sm:text-base">
                Select Personas
              </span>
            </div>
            <div className="w-4 sm:w-8 h-px bg-border" />
            <div
              className={`flex items-center gap-1 sm:gap-2 ${
                step === "tone"
                  ? "text-orange-500"
                  : step === "apikey" && personalityTone
                  ? "text-green-500"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                  step === "tone"
                    ? "bg-orange-500 text-white"
                    : step === "apikey" && personalityTone
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <span className="font-medium text-sm sm:text-base">
                Choose Tone
              </span>
            </div>
            <div className="w-4 sm:w-8 h-px bg-border" />
            <div
              className={`flex items-center gap-1 sm:gap-2 ${
                step === "apikey"
                  ? "text-orange-500"
                  : apiKey
                  ? "text-green-500"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                  step === "apikey"
                    ? "bg-orange-500 text-white"
                    : apiKey
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                3
              </div>
              <span className="font-medium text-sm sm:text-base">API Key</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === "persona" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-2">
                Choose Your AI Personas
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Select one or more personas to chat with. Each has unique
                expertise and personality.
              </p>
            </div>

            {/* Search and Filters - Made responsive */}
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search personas by name or expertise..."
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    className={`cursor-pointer transition-colors text-xs sm:text-sm ${
                      selectedCategory === category.id
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                    }`}
                    onClick={() => dispatch(setSelectedCategory(category.id))}
                  >
                    <category.icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Selected Personas */}
            {selectedPersonas.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium mb-3 text-sm sm:text-base">
                  Selected Personas ({selectedPersonas.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPersonas.map(
                    (persona: {
                      id: Key | null | undefined;
                      basic_information: {
                        name:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal

                          | null
                          | undefined;
                      };
                    }) => (
                      <Badge
                        key={persona.id}
                        variant="secondary"
                        className="bg-orange-100 text-orange-800 border-orange-200 text-xs sm:text-sm"
                      >
                        {persona.basic_information.name}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Personas Grid - Made responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredPersonas.map((persona) => (
                <PersonaCard
                  key={persona.id}
                  persona={persona}
                  isSelected={selectedPersonasMap.has(persona.id)}
                  onToggle={() => handlePersonaToggle(persona)}
                />
              ))}
            </div>

            {filteredPersonas.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No personas found matching your search criteria.
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={() => setStep("tone")}
                disabled={!canProceedFromPersona}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 w-full sm:w-auto"
              >
                Continue to Tone Selection
              </Button>
            </div>
          </div>
        )}

        {step === "tone" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-2">
                Choose Conversation Tone
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Select how you want your personas to communicate with you.
              </p>
            </div>

            <Suspense fallback={<LoadingSpinner />}>
              <ToneSelector
                selectedTone={personalityTone}
                onToneSelect={handleToneSelect}
              />
            </Suspense>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setStep("persona")}
                className="w-full sm:w-auto"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep("apikey")}
                disabled={!canProceedFromTone}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 w-full sm:w-auto"
              >
                Continue to API Setup
              </Button>
            </div>
          </div>
        )}

        {step === "apikey" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-2">
                Setup Your API Key
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Enter your Gemini API key to start chatting. Your key is stored
                locally and never shared.
              </p>
            </div>

            <Suspense fallback={<LoadingSpinner />}>
              <ApiKeySetup
                onApiKeySubmit={handleApiKeySubmit}
                currentApiKey={apiKey}
              />
            </Suspense>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setStep("tone")}
                className="w-full sm:w-auto"
              >
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={!canProceedFromApiKey}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 w-full sm:w-auto"
              >
                Start Chatting
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
