import { useState, useRef, useEffect } from "react";
import { Send, Mic, RotateCcw, Copy, Share2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  selectedMode: string;
}

export const ChatInterface = ({ selectedMode }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to LONI ASSISTANT. I'm your sovereign AI companion, ready to assist with elite precision. How may I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loaded from .env for dynamic configuration
  const fileUploadEndpoint = import.meta.env.VITE_FILE_UPLOAD_ENDPOINT || '/api/upload';
  const aiEndpoint = import.meta.env.VITE_AI_ENDPOINT || '/api/generate';
  const aiModel = import.meta.env.VITE_AI_MODEL || 'default';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I received your message in ${selectedMode} mode. This is a demonstration response. In a production environment, this would connect to an AI service to provide intelligent responses.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Uses VITE_FILE_UPLOAD_ENDPOINT to send file for analysis
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);

    // Add user message showing file upload
    const fileMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `📎 Uploaded file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, fileMessage]);

    // Simulate file analysis (in production, this would call fileUploadEndpoint)
    setTimeout(() => {
      const analysisMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I've received your file "${file.name}". File analysis capabilities will be available once connected to the AI backend. The file would be sent to: ${fileUploadEndpoint}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, analysisMessage]);
      setUploadingFile(false);
    }, 1500);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="max-w-3xl mx-auto py-6 space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  "p-4 paper-twist animate-frame-bounce shadow-silver",
                  message.role === "user" 
                    ? "bg-card ml-auto max-w-[85%]" 
                    : "bg-card mr-auto max-w-[85%]"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold">
                        {message.role === "user" ? "You" : "LONI"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "assistant" && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-[18px] hover:animate-bounce"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-[18px] hover:animate-bounce"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-[18px] hover:animate-bounce"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
          
          {isTyping && (
            <Card className="p-4 paper-twist animate-frame-bounce shadow-silver max-w-[85%]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
                <span className="text-sm text-muted-foreground">LONI is thinking...</span>
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          <Card className="p-4 paper-twist shadow-silver">
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
                  className="rounded-[18px] hover:animate-bounce hover:shadow-silver"
                  title="Upload file for analysis"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-[18px] hover:animate-bounce hover:shadow-silver"
                  title="Voice input"
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || uploadingFile}
                  className="rounded-[18px] bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:animate-bounce hover:shadow-silver"
                  size="icon"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Mode: <span className="text-primary font-semibold">{selectedMode}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
