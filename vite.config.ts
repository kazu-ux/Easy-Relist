import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx, defineManifest } from '@crxjs/vite-plugin';

const manifest = defineManifest({
  manifest_version: 3,
  name: 'らくらく再出品',
  version: '1.5',
  options_page: 'index.html',
  permissions: ['webRequest', 'scripting', 'tabs', 'storage'],

  background: { service_worker: 'src/service_worker.ts' },
  host_permissions: [
    'https://api.mercari.jp/items/get?id=*',
    'https://api.mercari.jp/draft_items/save',
    'https://api.mercari.jp/draft_items/gets',
    'https://jp.mercari.com/transaction/*',
  ],
});

export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
