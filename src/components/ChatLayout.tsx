"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  Plus,
  Settings,
  MessageSquare,
  Folder,
  Pin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatLayoutProps {
  children: React.ReactNode;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onSelectChat?: (id: string) => void;
  modelStatus?: string;
  isStreaming?: boolean;
}

export const ChatLayout = ({
  children,
  onNewChat,
  onOpenSettings,
  onSelectChat,
  modelStatus = "idle",
  isStreaming = false,
}: ChatLayoutProps) => {
  // ✅ Detect mobile screen width
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // ✅ Listen for resize events to adapt dynamically
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Update sidebar state if viewport changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const [chatHistory] = useState([
    { id: "1", title: "Previous conversation", timestamp: "2 hours ago" },
    { id: "2", title: "Another chat", timestamp: "Yesterday" },
    { id: "3", title: "Older discussion", timestamp: "3 days ago" },
  ]);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* 🧠 Sidebar */}
      <aside
        className={cn(
          "transition-all duration-300 border-r border-border bg-sidebar flex flex-col",
          sidebarOpen ? "w-64" : "w-0",
          "md:w-64 md:static absolute z-40"
        )}
      >
        {sidebarOpen && (
          <div className="flex flex-col h-full">
            {/* ➕ New Chat Button */}
            <div className="p-4 border-b border-border">

      <Button
  onClick={() => {
    onNewChat(); // ✅ trigger parent logic
    if (isMobile) setSidebarOpen(false); // ✅ auto-close on mobile
  }}
  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-[18px] hover:animate-bounce hover:shadow-[0_0_8px_#98fdfc]"
>
  <Plus className="mr-2 h-4 w-4" />
  New Chat
</Button>

            </div>

            {/* 💬 Chat History */}
            <ScrollArea className="flex-1 px-3">
              <div className="space-y-2 py-4">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <Pin className="h-4 w-4 text-[#c8f051]" />
                  <span>Pinned</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4 text-[#c8f051]" />
                  <span>Recent</span>
                </div>

                {chatHistory.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="w-full justify-start text-left rounded-[18px] hover:bg-sidebar-accent hover:animate-bounce hover:shadow-[0_0_8px_#98fdfc]"
                    onClick={() => onSelectChat?.(chat.id)}
                  >
                    <div className="flex flex-col items-start overflow-hidden">
                      <span className="truncate w-full text-sm text-[#c8f051]">
                        {chat.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {chat.timestamp}
                      </span>
                    </div>
                  </Button>
                ))}

                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground mt-4">
                  <Folder className="h-4 w-4 text-[#c8f051]" />
                  <span>Folders</span>
                </div>
              </div>
            </ScrollArea>

            {/* ⚙️ Settings Button */}
            <div className="p-4 border-t border-border">
              <Button
                onClick={onOpenSettings}
                variant="ghost"
                className="w-full justify-start rounded-[18px] hover:bg-sidebar-accent hover:animate-bounce hover:shadow-[0_0_8px_#98fdfc]"
              >
                <Settings className="mr-2 h-4 w-4 text-[#c8f051]" />
                <span className="text-[#c8f051]">Settings</span>
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* 🧩 Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* 🔝 Header */}
        <header className="border-b border-border px-4 py-3 flex items-center justify-between bg-background z-10">
          <div className="flex items-center gap-3">
            {/* ☰ Toggle Button (mobile only) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-[18px] hover:animate-bounce hover:shadow-[0_0_8px_#98fdfc] md:hidden"
              title="Toggle sidebar"
            >
              <Menu className="h-5 w-5 text-[#c8f051]" />
            </Button>

            <h1 className="text-xl font-bold text-[#c8f051] drop-shadow-[0_0_8px_#98fdfc]">
              LONI ASSISTANT
            </h1>
          </div>

          {/* ⚡ Model Status */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isStreaming ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#c8f051]" />
                <span className="text-[#c8f051]">Responding...</span>
              </>
            ) : (
              <span className="text-[#c8f051]">Status: {modelStatus}</span>
            )}
          </div>
        </header>

        {/* 💬 Chat Area */}
        <ScrollArea className="flex-1 overflow-y-auto px-4 py-2 bg-background">
          {children}
        </ScrollArea>
      </div>
    </div>
  );
};

