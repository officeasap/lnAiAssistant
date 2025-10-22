import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// 🧠 Optional: Lazy load future pages
// const Settings = lazy(() => import("./pages/Settings"));
// const ChatHistory = lazy(() => import("./pages/ChatHistory"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* 🔔 Toasts for feedback */}
      <Toaster />
      <Sonner />

      {/* 🧭 Routing */}
      <BrowserRouter>
        <Routes>
          {/* 🧠 Main Assistant Entry */}
          <Route path="/" element={<Index />} />

          {/* 🔮 Future Routes (add above catch-all) */}
          {/* <Route path="/settings" element={<Settings />} /> */}
          {/* <Route path="/history" element={<ChatHistory />} /> */}

          {/* 🚫 Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

