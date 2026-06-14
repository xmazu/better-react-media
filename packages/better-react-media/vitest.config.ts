import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    coverage: {
      enabled: true,
      exclude: ['test/**', '**/index.ts', 'types.ts'],
      include: ['src/**/*.{ts,tsx}'],
    },
    dir: 'test',
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
    testTimeout: 30_000,
  },
});
