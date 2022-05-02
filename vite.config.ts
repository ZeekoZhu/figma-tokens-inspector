import path from 'path';
import { defineConfig } from 'vite';
import browserExtension from 'vite-plugin-web-extension';
import react from '@vitejs/plugin-react';

function root(...paths: string[]): string {
  return path.resolve(__dirname, ...paths);
}

export default defineConfig({
  root: 'src',
  build: {
    outDir: root('dist'),
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ['react/jsx-runtime', 'react-dom'],
  },
  plugins: [
    react(),
    browserExtension({
      manifest: root('src/manifest.json'),
      assets: 'assets',
      browser: process.env.TARGET,
      additionalInputs: [
        'figma-bridge.ts'
      ],
      webExtConfig: {
        chromiumProfile: './.cache/chromium-profile',
        profileCreateIfMissing: true,
        keepProfileChanges: true
      },
      verbose: true,
    }),
  ],
});
