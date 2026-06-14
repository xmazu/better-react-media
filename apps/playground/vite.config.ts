import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = import.meta.dirname;

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/better-react-media/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@workspace/ui/globals.css': path.resolve(
        __dirname,
        '../../packages/ui/src/styles/globals.css'
      ),
      '@workspace/ui/components': path.resolve(
        __dirname,
        '../../packages/ui/src/components'
      ),
      '@/components/ui': path.resolve(
        __dirname,
        '../../packages/ui/src/components'
      ),
      '@workspace/ui/lib/utils': path.resolve(
        __dirname,
        '../../packages/ui/src/lib/utils.ts'
      ),
    },
    conditions: ['import', 'module', 'browser', 'default'],
  },
  server: {
    allowedHosts: ['.local'],
  },
});
