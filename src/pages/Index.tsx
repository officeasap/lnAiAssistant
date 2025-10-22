"use client";

import { useState } from "react";
import { ChatLayout } from "@/components/ChatLayout";
import { ChatInterface } from "@/components/ChatInterface";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

/**
 * 🧠 L-PROFESSOR AI ASSISTANT
 * Sovereign AI Interface – privacy, power, precision.
 */
const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("Quick Response");
  const [status, setStatus] = useState("idle");
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const handleNewChat = () => {
    setMessages([]); // 🔁 Reset assistant state
    setStatus("idle");
    setIsStreaming(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleModelActivity = (state: "idle" | "thinking" | "responding") => {
    if (state === "thinking") {
      setStatus("thinking");
      setIsStreaming(true);
    } else if (state === "responding") {
      setStatus("responding");
      setIsStreaming(true);
    } else {
      setStatus("idle");
      setIsStreaming(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>LONI ASSISTANT — Sovereign AI Companion</title>
        <meta
          name="description"
          content="LONI ASSISTANT — Elite AI companion built for sovereign-grade intelligence and absolute privacy."
        />
        <meta
          name="keywords"
          content="LONI AI, sovereign AI, encrypted assistant, private AI, chat intelligence, futuristic chatbot"
        />
        <meta property="og:title" content="LONI ASSISTANT — Sovereign AI Companion" />
        <meta
          property="og:description"
          content="Experience elite, encrypted, sovereign-grade intelligence with LONI."
        />
        <meta property="og:image" content="/assistanAI.png" />
        <meta name="theme-color" content="#0a0a0a" />
      </Helmet>

      {/* 🚀 Core Chat Layout */}
      <ChatLayout
        onNewChat={handleNewChat}
        onOpenSettings={() => setSettingsOpen(true)}
        modelStatus={status}
        isStreaming={isStreaming}
      >
        {/* ✨ Wrapped for smooth appearance */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ChatInterface
            selectedMode={selectedMode}
            messages={messages}
            setMessages={setMessages}
            onModelActivity={handleModelActivity}
          />
        </motion.div>
      </ChatLayout>

      {/* ⚙️ Sovereign Settings Panel */}
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

