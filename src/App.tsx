import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "./components/molecules/Sonner/Sonner";
import { TooltipProvider } from "./components/molecules/Tooltip/Tooltip";
import { DefaultColorThemeProvider } from "./contexts/DefaultColorThemeContext";
import Index from "./components/pages/Index";
import NotFound from "./components/pages/NotFound";
import BlogsPage from "./components/pages/BlogsPage";
import BlogPostPage from "./components/pages/BlogPostPage";
import ExplorePage from "./components/pages/ExplorePage";
import TestimonialSubmitPage from "./components/pages/TestimonialSubmitPage";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <DefaultColorThemeProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blogs/:slug" element={<BlogPostPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/testimonial/:token" element={<TestimonialSubmitPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DefaultColorThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
