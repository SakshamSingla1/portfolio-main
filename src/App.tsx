import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "./components/molecules/Sonner/Sonner";
import { Toaster } from "./components/molecules/Toaster/Toaster";
import { TooltipProvider } from "./components/molecules/Tooltip/Tooltip";
import { DefaultColorThemeProvider } from "./contexts/DefaultColorThemeContext";
import Index from "./components/pages/Index";
import NotFound from "./components/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DefaultColorThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DefaultColorThemeProvider>
  </QueryClientProvider>
);

export default App;
