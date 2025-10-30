import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import { EventDetails } from "./pages/EventDetails";
import NotFound from "./pages/NotFound";
import BuiltBy from "./components/ui/BuiltBy";
import TrumpPosts from "./pages/TrumpPosts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/event/:eventId" element={<EventDetails />} />
            <Route path="/trump-posts" element={<TrumpPosts />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <BuiltBy />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
