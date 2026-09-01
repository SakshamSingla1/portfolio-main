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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('dompurify')) return 'vendor-dompurify';
          if (id.includes('formik') || id.includes('yup')) return 'vendor-forms';
          if (id.includes('axios')) return 'vendor-http';
          if (id.includes('dayjs')) return 'vendor-date';
          if (id.includes('sonner')) return 'vendor-sonner';
          if (id.includes('react-github-calendar')) return 'vendor-github-calendar';
          if (id.includes('html-react-parser')) return 'vendor-html-parser';
          if (id.includes('react-icons')) return 'vendor-icons';
        },
      },
    },
  },
})
