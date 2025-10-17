import { useState } from "react";
import { Menu, Plus, Settings, MessageSquare, Folder, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatLayoutProps {
  children: React.ReactNode;
  onNewChat: () => void;
  onOpenSettings: () => void;
}

export const ChatLayout = ({ children, onNewChat, onOpenSettings }: ChatLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory] = useState([
    { id: "1", title: "Previous conversation", timestamp: "2 hours ago" },
    { id: "2", title: "Another chat", timestamp: "Yesterday" },
    { id: "3", title: "Older discussion", timestamp: "3 days ago" },
  ]);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "transition-all duration-300 border-r border-border bg-sidebar flex flex-col",
          sidebarOpen ? "w-64" : "w-0"
        )}
      >
        {sidebarOpen && (
          <div className="flex flex-col h-full">
            {/* New Chat Button */}
            <div className="p-4 border-b border-border">
              <Button
                onClick={onNewChat}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-[18px] hover:animate-bounce hover:shadow-silver"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            </div>

            {/* Chat History */}
            <ScrollArea className="flex-1 px-3">
              <div className="space-y-2 py-4">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <Pin className="h-4 w-4" />
                  <span>Pinned</span>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>Recent</span>
                </div>
                
                {chatHistory.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="w-full justify-start text-left rounded-[18px] hover:bg-sidebar-accent hover:animate-bounce"
                  >
                    <div className="flex flex-col items-start overflow-hidden">
                      <span className="truncate w-full text-sm">{chat.title}</span>
                      <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                    </div>
                  </Button>
                ))}

                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground mt-4">
                  <Folder className="h-4 w-4" />
                  <span>Folders</span>
                </div>
              </div>
            </ScrollArea>

            {/* Settings */}
            <div className="p-4 border-t border-border">
              <Button
                onClick={onOpenSettings}
                variant="ghost"
                className="w-full justify-start rounded-[18px] hover:bg-sidebar-accent hover:animate-bounce"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-[18px] hover:animate-bounce hover:shadow-silver"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">LONI ASSISTANT</h1>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
