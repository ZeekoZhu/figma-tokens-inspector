import fs from 'fs-extra';

import { r } from './utils';
import PkgType from '../package.json';
import { ManifestV3Export } from '@crxjs/vite-plugin';

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType;

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: ManifestV3Export = {
    manifest_version: 3,
    name: 'Figma Tokens Inspector',
    version: pkg.version,
    description: 'Inspect Figma tokens',
    content_scripts: [
      {
        matches: [
          'https://*.figma.com/*',
        ],
        js: [
          'src/content-script/index.ts',
        ],
      },
    ],
    permissions: [
      'tabs',
      'storage',
      'activeTab',
      'webNavigation',
    ],
  };

  return manifest;
}
