import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "0.0.0.0",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "import.meta.env.VITE_OPENROUTER_API": JSON.stringify(env.VITE_OPENROUTER_API),
      "import.meta.env.VITE_OPENROUTER_KEY": JSON.stringify(env.VITE_OPENROUTER_KEY),
      "import.meta.env.VITE_OPENROUTER_MODELS": JSON.stringify(env.VITE_OPENROUTER_MODELS),
    },
  };
});
