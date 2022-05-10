import { defineConfig, UserConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import AutoImport from 'unplugin-auto-import/vite';

import { isDev, r } from './scripts/utils';
import { getManifest } from './scripts/manifest';

export const sharedConfig: UserConfig = {
  resolve: {
    alias: {
      '~/': `${r('src')}/`,
    },
  },
  optimizeDeps: {
    include: [ 'react/jsx-runtime', 'react-dom', 'webextension-polyfill' ],
  },
  plugins: [
    react(),
    AutoImport({
      imports: [
        'react',
        {
          'webextension-polyfill': [
            [ '*', 'browser' ],
          ],
        },
      ],
      dts: r('src/auto-imports.d.ts'),
    }),
  ],
};
// bundling the content script using Vite
export default defineConfig(async () => ({
  ...sharedConfig,
  plugins: [
    ...sharedConfig.plugins!,
    crx({
      manifest: await getManifest(),
    }),
  ],
  build: {
    outDir: r('extension'),
    emptyOutDir: true,
  },
}));
