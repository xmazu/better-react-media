import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const pluginEntries = [
  'captions',
  'counter',
  'download',
  'fullscreen',
  'inline',
  'slideshow',
  'thumbnails',
  'zoom',
] as const;

const input = Object.fromEntries([
  ['index', path.resolve(import.meta.dirname, 'src/index.ts')],
  ...pluginEntries.map((plugin) => [
    `plugins/${plugin}/index`,
    path.resolve(import.meta.dirname, `src/plugins/${plugin}/index.ts`),
  ]),
]);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: input,
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'lucide-react',
        'clsx',
        'tailwind-merge',
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles.css';
          }
          return '[name][extname]';
        },
      },
    },
    cssCodeSplit: false,
  },
});
