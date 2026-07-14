import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "./components/molecules/Sonner/Sonner";
import { TooltipProvider } from "./components/molecules/Tooltip/Tooltip";
import { DefaultColorThemeProvider } from "./contexts/DefaultColorThemeContext";
import Index from "./components/pages/Index";
import NotFound from "./components/pages/NotFound";
import { HelmetProvider } from "react-helmet-async";

const BlogsPage = lazy(() => import("./components/pages/BlogsPage"));
const BlogPostPage = lazy(() => import("./components/pages/BlogPostPage"));
const ExplorePage = lazy(() => import("./components/pages/ExplorePage"));
const TestimonialSubmitPage = lazy(() => import("./components/pages/TestimonialSubmitPage"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <DefaultColorThemeProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blogs" element={<BlogsPage />} />
                <Route path="/blogs/:slug" element={<BlogPostPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/testimonial/:token" element={<TestimonialSubmitPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </DefaultColorThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
