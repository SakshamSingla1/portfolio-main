import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultColorThemeProvider } from "./contexts/DefaultColorThemeContext";
import Index from "./components/pages/Index";
import { HelmetProvider } from "react-helmet-async";

const BlogsPage = lazy(() => import("./components/pages/BlogsPage"));
const BlogPostPage = lazy(() => import("./components/pages/BlogPostPage"));
const ExplorePage = lazy(() => import("./components/pages/ExplorePage"));
const TestimonialSubmitPage = lazy(() => import("./components/pages/TestimonialSubmitPage"));
const NotFound = lazy(() => import("./components/pages/NotFound"));

const CLOUDINARY_TRANSFORM_PATTERN = /(res\.cloudinary\.com\/[^/]+\/image\/upload\/)[^/]+\//;

const App = () => {
  useEffect(() => {
    const handleImageError = (event: Event) => {
      const img = event.target;
      if (!(img instanceof HTMLImageElement)) return;
      if (img.dataset.cloudinaryFallback) return;
      const fallbackSrc = img.src.replace(CLOUDINARY_TRANSFORM_PATTERN, "$1");
      if (fallbackSrc === img.src) return;
      img.dataset.cloudinaryFallback = "true";
      img.src = fallbackSrc;
    };
    document.addEventListener("error", handleImageError, true);
    return () => document.removeEventListener("error", handleImageError, true);
  }, []);

  return (
    <HelmetProvider>
      <DefaultColorThemeProvider>
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
      </DefaultColorThemeProvider>
    </HelmetProvider>
  );
};

export default App;
