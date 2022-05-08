import fs from 'fs-extra';

import { isDev, log, port, r } from './utils';
import PkgType from '../package.json';
import { Manifest } from 'webextension-polyfill';

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType;

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
    name: 'Figma Tokens Inspector',
    version: pkg.version,
    description: 'Inspect Figma tokens',
    icons: {
      '16': 'assets/icons/logo.svg',
      '48': 'assets/icons/logo.svg',
      '128': 'assets/icons/logo.svg',
    },
    background: {
      page: './dist/background/index.html',
      persistent: false,
    },
    // web_accessible_resources: [
    //   'figma-bridge.js',
    // ],
    content_scripts: [
      {
        matches: [
          '*://*/*',
        ],
        js: [
          './dist/content-script/index.global.js',
        ],
      },
    ],
    permissions: [
      'tabs',
      'storage',
      'activeTab',
      'http://*/',
      'https://*/',
    ],
  };

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts;
    manifest.permissions?.push('webNavigation');

    // this is required on dev for Vite script to load
    manifest.content_security_policy = `script-src \'self\' http://localhost:${port}; object-src \'self\'`;
  }

  return manifest;
}

export async function writeManifest() {
  await fs.writeJSON(r('extension/manifest.json'), await getManifest(), { spaces: 2 });
  log('PRE', 'write manifest.json');
}

writeManifest();
