// 📁 src/utils/loniFileManager.ts
// ⚡ Handles local chat logging to "lonidata.txt"
// Works in local Node/Vite/Next dev environments — silent and automatic.
// 📁 src/utils/loniFileManager.ts
export interface ChatEntry {
  timestamp: string;
  model: string;
  prompt: string;
  response: string;
}

// 💾 Safe universal file-saving system
export const saveChatToFile = async (entry: ChatEntry) => {
  const data = `[${entry.timestamp}] (${entry.model})\nPrompt: ${entry.prompt}\nResponse: ${entry.response}\n\n`;

  // ✅ Browser environment: simulate file log
  if (typeof window !== "undefined") {
    console.log("🪶 LONI simulated save:", data);
    // optionally keep a local backup
    const existing = localStorage.getItem("lonidata") || "";
    localStorage.setItem("lonidata", existing + data);
    return;
  }

  // ✅ Node.js (local development, server-side build)
  try {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(process.cwd(), "lonidata.txt");

    fs.appendFileSync(filePath, data, "utf8");
    console.log("✅ Chat saved to lonidata.txt");
  } catch (err) {
    console.warn("⚠️ Unable to write file (non-Node environment):", err);
  }
};
