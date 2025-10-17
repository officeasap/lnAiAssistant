import { useState } from "react";
import { ChatLayout } from "@/components/ChatLayout";
import { ChatInterface } from "@/components/ChatInterface";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Helmet } from "react-helmet";

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("Quick Response");

  const handleNewChat = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>LONI ASSISTANT - Sovereign AI Assistant</title>
        <meta 
          name="description" 
          content="LONI ASSISTANT - Your elite AI companion with sovereign-grade encryption and professional capabilities. Private, powerful, and mythically branded." 
        />
        <meta name="keywords" content="AI assistant, chat, artificial intelligence, encrypted AI, private AI" />
      </Helmet>

      <ChatLayout onNewChat={handleNewChat} onOpenSettings={() => setSettingsOpen(true)}>
        <ChatInterface selectedMode={selectedMode} />
      </ChatLayout>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
      />
    </>
  );
};

export default Index;
