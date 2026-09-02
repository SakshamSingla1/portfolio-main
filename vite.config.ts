import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    modulePreload: {
      // vendor-sonner is only ever reached via a dynamic import() inside
      // ContactSection's submit handler, but Rollup's manualChunks-as-a-
      // function grouping can't prove that from the chunk graph alone, so
      // Vite conservatively modulepreloads it on every page. Exclude it
      // explicitly -- the dynamic import still works at submit time either way.
      resolveDependencies: (_filename, deps) => deps.filter((dep) => !dep.includes('vendor-sonner')),
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('dompurify')) return 'vendor-dompurify';
          if (id.includes('formik') || id.includes('yup')) return 'vendor-forms';
          if (id.includes('axios')) return 'vendor-http';
          if (id.includes('dayjs')) return 'vendor-date';
          // sonner is intentionally NOT force-grouped here: it's only ever
          // reached via dynamic import() from ContactSection, and manually
          // forcing it into a named chunk was creating a static import edge
          // back into the main entry chunk (verified in the build output),
          // eagerly pulling it into every page load. Left to Rollup's default
          // per-dynamic-import chunking, it gets its own async-only chunk.
          if (id.includes('react-github-calendar')) return 'vendor-github-calendar';
          if (id.includes('html-react-parser')) return 'vendor-html-parser';
          if (id.includes('react-icons')) return 'vendor-icons';
        },
      },
    },
  },
})
