"use client";

import { Sparkles } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto animate-pulse">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Loading FFP CHAT
          </h2>
          <p className="text-muted-foreground">
            Please wait while we prepare your experience...
          </p>
        </div>
      </div>
    </div>
  );
}
