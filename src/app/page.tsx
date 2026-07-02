"use client";

import { Suspense, lazy } from "react";
import { useAppSelector } from "@/hooks/redux";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary";

const PersonaSetup = lazy(() =>
  import("@/components/persona-setup").then((module) => ({
    default: module.PersonaSetup,
  }))
);
const ChatInterface = lazy(() =>
  import("@/components/chat-interface").then((module) => ({
    default: module.ChatInterface,
  }))
);

export default function HomePage() {
  const { isPersonaSetupComplete } = useAppSelector((state) => state.persona);
  const { isApiKeySet } = useAppSelector((state) => state.settings);

  const isSetupComplete = isPersonaSetupComplete && isApiKeySet;

  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          {!isSetupComplete ? <PersonaSetup /> : <ChatInterface />}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
