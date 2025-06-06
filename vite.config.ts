import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "./en": path.resolve(__dirname, "./src/lib/en.ts"),
      "date-fns/locale": path.resolve(__dirname, "./node_modules/date-fns/locale")
    },
  },
  optimizeDeps: {
    include: ['date-fns', 'date-fns-tz']
  },
}));
