"use client";

import { useState, useMemo } from "react";
import { useAppSelector } from "@/hooks/redux";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatMain } from "@/components/chat-main";
import { ChatHeader } from "@/components/chat-header";
import { Footer } from "@/components/footer";

export function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedPersonas } = useAppSelector((state) => state.persona);

  const memoizedPersonas = useMemo(() => selectedPersonas, [selectedPersonas]);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Improved mobile responsiveness */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-50 w-72 sm:w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <ChatSidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatHeader
            onMenuClick={() => setSidebarOpen(true)}
            selectedPersonas={memoizedPersonas}
          />
          <ChatMain />
        </div>
      </div>

      {/* Footer - Added footer component */}
      <Footer />
    </div>
  );
}
