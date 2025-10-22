"use client";

import {
  X,
  User,
  Palette,
  Globe,
  Zap,
  Brain,
  Mic,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMode: string;
  onModeChange: (mode: string) => void;
}

const modes = [
  {
    id: "quick",
    name: "Quick Response",
    icon: Zap,
    description: "Fast, concise answers",
  },
  {
    id: "deep",
    name: "Think Deeper",
    icon: Brain,
    description: "Thorough analysis",
  },
  {
    id: "study",
    name: "Study Mode",
    icon: Globe,
    description: "Educational focus",
  },
  {
    id: "smart",
    name: "Smart Mode",
    icon: Palette,
    description: "Adaptive responses",
  },
];

export const SettingsPanel = ({
  isOpen,
  onClose,
  selectedMode,
  onModeChange,
}: SettingsPanelProps) => {
  if (!isOpen) return null;

  // 🔧 Local state for toggles and selections
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceType, setVoiceType] = useState("neural");
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [language, setLanguage] = useState("en");

  // 💾 Save handler
  const handleSave = () => {
    const settings = {
      mode: selectedMode,
      voiceEnabled,
      voiceType,
      memoryEnabled,
      dataSharing,
      language,
    };
    console.log("🔐 Saved Settings:", settings);
    // Optionally persist settings (e.g., localStorage or Supabase)
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl"
      >
        <Card className="paper-twist shadow-silver animate-frame-bounce">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-[18px] hover:animate-bounce"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Scrollable Settings Area */}
          <ScrollArea className="max-h-[70vh]">
            <div className="p-6 space-y-6">
              {/* 🧑 Account */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Account</h3>
                </div>
                <Card className="p-4 bg-muted/30">
                  <p className="text-sm">Elite User</p>
                  <p className="text-xs text-muted-foreground">
                    Sovereign Access
                  </p>
                </Card>
              </div>

              {/* ⚙️ Conversation Modes */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-secondary" />
                  <h3 className="text-lg font-semibold">Conversation Modes</h3>
                </div>
                <div className="grid gap-3">
                  {modes.map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <Card
                        key={mode.id}
                        className={`p-4 cursor-pointer transition-all hover:animate-bounce ${
                          selectedMode === mode.name
                            ? "bg-primary/20 border-primary signal-glow"
                            : "hover:bg-muted/30"
                        }`}
                        onClick={() => onModeChange(mode.name)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <div className="flex-1">
                            <p className="font-semibold">{mode.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {mode.description}
                            </p>
                          </div>
                          {selectedMode === mode.name && (
                            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* 🎙️ Voice */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-semibold">Voice Settings</h3>
                </div>
                <Card className="p-4 bg-muted/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voice-enabled">Voice Responses</Label>
                    <Switch
                      id="voice-enabled"
                      checked={voiceEnabled}
                      onCheckedChange={setVoiceEnabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Voice Selection</Label>
                    <Select value={voiceType} onValueChange={setVoiceType}>
                      <SelectTrigger className="rounded-[18px]">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neural">Neural Voice</SelectItem>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>
              </div>

              {/* 🧠 Memory */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    Memory & Personalization
                  </h3>
                </div>
                <Card className="p-4 bg-muted/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="memory-enabled">Enable Memory</Label>
                    <Switch
                      id="memory-enabled"
                      checked={memoryEnabled}
                      onCheckedChange={setMemoryEnabled}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    LONI remembers context from your conversations to provide
                    better assistance.
                  </p>
                </Card>
              </div>

              {/* 🛡️ Privacy */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-secondary" />
                  <h3 className="text-lg font-semibold">Privacy & Data</h3>
                </div>
                <Card className="p-4 bg-muted/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="data-sharing">Data Sharing</Label>
                    <Switch
                      id="data-sharing"
                      checked={dataSharing}
                      onCheckedChange={setDataSharing}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All conversations are encrypted and stored with
                    sovereign-grade security.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full rounded-[18px] hover:animate-bounce hover:shadow-silver"
                    onClick={() =>
                      window.open(
                        "https://privacy.microsoft.com/en-us/privacystatement",
                        "_blank"
                      )
                    }
                  >
                    View Privacy Policy
                  </Button>
                </Card>
              </div>

              {/* 🌐 Language */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-semibold">Language</h3>
                </div>
                <Card className="p-4 bg-muted/30 space-y-4">
                  <Label htmlFor="language-select">Select Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger
                      id="language-select"
                      className="rounded-[18px]"
                    >
                      <SelectValue placeholder="Choose language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="jp">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </Card>
              </div>
            </div>
          </ScrollArea>

          {/* 💾 Save Button */}
          <div className="p-6 border-t border-border">
            <Button
              onClick={handleSave}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-[18px] hover:animate-bounce hover:shadow-silver"
            >
              Save Settings
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
