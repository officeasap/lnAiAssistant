"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, RotateCcw, Copy, Share2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { saveChatToFile } from "@/utils/loniFileManager";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  selectedMode: string;
  messages: { role: string; content: string }[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  onModelActivity: (state: "idle" | "thinking" | "responding") => void;
}

export const ChatInterface = ({
  selectedMode,
  messages,
  setMessages,
  onModelActivity,
}: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔒 Securely loaded from environment (Vercel-safe)
  const OPENROUTER_API =
    import.meta.env.VITE_OPENROUTER_API ||
    "https://openrouter.ai/api/v1/chat/completions";
  const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_KEY || "";

  let modelPool: string[] = [];
  try {
    const rawModels = import.meta.env.VITE_OPENROUTER_MODELS || "[]";
    modelPool = JSON.parse(rawModels);
    if (!Array.isArray(modelPool) || modelPool.length === 0) {
      throw new Error("Model pool is empty");
    }
  } catch (err) {
    console.warn("⚠️ Failed to parse model pool:", err);
    modelPool = ["mistralai/mistral-7b-instruct:free"];
  }

  // 💾 Log chats locally and file-based
  const logToLocal = (prompt: string, response: string, model: string) => {
    const logs = JSON.parse(localStorage.getItem("chatLog") || "[]");
    const entry = {
      timestamp: new Date().toISOString(),
      model,
      prompt,
      response,
    };
    logs.push(entry);
    localStorage.setItem("chatLog", JSON.stringify(logs));
    saveChatToFile(entry);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 🚀 Message sending logic
  const handleSend = async (customPrompt?: string) => {
    const query = customPrompt || input;
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput("");
    setIsTyping(true);
    onModelActivity("thinking");

    let aiText = "";
    let success = false;

    if (!OPENROUTER_KEY) {
      console.error("🚫 Missing OpenRouter API key");
      aiText =
        "🚫 LONI is misconfigured. No API key was provided. Please check your environment variables.";
    } else {
      for (const model of modelPool) {
        try {
          const response = await fetch(OPENROUTER_API, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${OPENROUTER_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: "system",
                  content:
                    "You are LONI — an elite sovereign AI assistant. Respond clearly, precisely, and intelligently.",
                },
                { role: "user", content: query },
              ],
            }),
          });

          const result = await response.json();
          console.log(`🔍 Model ${model} response:`, result);

          if (!result || !result.choices?.[0]?.message?.content) {
            console.warn(`⚠️ Model ${model} returned empty or invalid response`);
            continue;
          }

          aiText = result.choices[0].message.content;
          logToLocal(query, aiText, model);
          success = true;
          break;
        } catch (err) {
          console.error(`⚠️ Model ${model} threw error:`, err);
          continue;
        }
      }
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: success
        ? aiText
        : aiText ||
          "🚫 All models are currently unavailable or rate-limited. Please try again later.",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
    onModelActivity("idle");
  };

  // ⌨️ Send on Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 📎 File upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);

    const fileMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `📎 Uploaded file: ${file.name} (${(file.size / 1024).toFixed(
        2
      )} KB)`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, fileMessage]);

    const analysisMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `I've received your file "${file.name}". File analysis will be available soon.`,
      timestamp: new Date(),
    };
    setTimeout(() => {
      setMessages((prev) => [...prev, analysisMessage]);
      setUploadingFile(false);
    }, 1500);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 🎨 UI
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 py-3 border-b border-border bg-transparent">
        <img
          src="/loniAssistant1.png"
          alt="LONI Avatar"
          className="w-8 h-8 rounded-full shadow-[0_0_10px_#98fdfc]"
        />
        <h2 className="text-lg font-semibold text-[#c8f051]">
          LONI ASSISTANT
        </h2>
      </div>

      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="max-w-3xl mx-auto py-6 space-y-6">
          {messages.map((message: any, index: number) => (
            <motion.div
              key={message.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  "p-4 paper-twist animate-frame-bounce",
                  "shadow-[0_0_10px_#98fdfc]",
                  message.role === "user"
                    ? "bg-card ml-auto max-w-[85%]"
                    : "bg-card mr-auto max-w-[85%]"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          message.role === "assistant"
                            ? "text-[#f0f051]"
                            : "text-[#50c8f0]"
                        )}
                      >
                        {message.role === "user" ? "You" : "LONI"}
                      </span>
                      <span className="text-xs text-[#a0a0a0]">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-sm whitespace-pre-wrap",
                        message.role === "assistant"
                          ? "text-[#f0f051]"
                          : "text-[#e0f7ff]"
                      )}
                    >
                      {message.content}
                    </p>
                  </div>

                  {message.role === "assistant" && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-[18px] hover:animate-bounce"
                        onClick={() =>
                          navigator.clipboard.writeText(message.content)
                        }
                        title="Copy message"
                      >
                        <Copy className="h-4 w-4 text-[#c8f051]" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-[18px] hover:animate-bounce"
                        onClick={() =>
                          handleSend(messages[messages.length - 2]?.content || "")
                        }
                        title="Regenerate response"
                      >
                        <RotateCcw className="h-4 w-4 text-[#c8f051]" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-[18px] hover:animate-bounce"
                        onClick={() =>
                          navigator.share?.({
                            title: "LONI Response",
                            text: message.content,
                          })
                        }
                        title="Share response"
                      >
                        <Share2 className="h-4 w-4 text-[#c8f051]" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}

          {isTyping && (
            <Card className="p-4 paper-twist shadow-[0_0_10px_#98fdfc] max-w-[85%]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                  <span
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
                <span className="text-sm text-[#c8f051]">
                  LONI is thinking...
                </span>
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          <Card className="p-4 paper-twist shadow-[0_0_10px_#98fdfc]">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Message LONI ASSISTANT..."
                className="min-h-[60px] resize-none bg-transparent border-0 focus-visible:ring-0"
              />

              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="*/*"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                  className="rounded-[18px] hover:animate-bounce shadow-[0_0_10px_#98fdfc]"
                >
                  <Paperclip className="h-5 w-5 text-[#c8f051]" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-[18px] hover:animate-bounce shadow-[0_0_10px_#98fdfc]"
                  title="Voice input (coming soon)"
                  disabled
                >
                  <Mic className="h-5 w-5 text-[#c8f051]" />
                </Button>

                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || uploadingFile}
                  className="rounded-[18px] bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:animate-bounce shadow-[0_0_10px_#98fdfc]"
                  size="icon"
                  title="Send message"
                >
                  <Send className="h-5 w-5 text-[#c8f051]" />
                </Button>
              </div>
            </div>
          </Card>

          <p className="text-xs text-center text-muted-foreground mt-2">
            Mode:{" "}
            <span className="text-primary font-semibold">{selectedMode}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

