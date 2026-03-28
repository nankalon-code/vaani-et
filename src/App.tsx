import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Onboard from "./pages/Onboard.tsx";
import StoryArc from "./pages/StoryArc.tsx";
import Brief from "./pages/Brief.tsx";
import SebiMapper from "./pages/SebiMapper.tsx";
import SilenceDetector from "./pages/SilenceDetector.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboard" element={<Onboard />} />
          <Route path="/arc" element={<StoryArc />} />
          <Route path="/brief" element={<Brief />} />
          <Route path="/sebi" element={<SebiMapper />} />
          <Route path="/silence" element={<SilenceDetector />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
