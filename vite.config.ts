import { crx, defineManifest } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const manifest = defineManifest({
  manifest_version: 3,
  name: 'らくらく再出品',
  version: '1.4',
  icons: {
    '16': 'public/icons/16.png',
    '32': 'public/icons/32.png',
    '48': 'public/icons/48.png',
    '128': 'public/icons/128.png',
  },
  content_scripts: [
    {
      matches: ['https://jp.mercari.com/*'],
      js: ['src/ContentScripts/content_script.ts'],
    },
    {
      matches: ['https://jp.mercari.com/item/*'],
      js: ['src/ContentScripts/SoldPage/sold_page_script.ts'],
    },
  ],
  background: {
    service_worker: 'src/Background/background.ts',
  },
  permissions: ['scripting'],
  host_permissions: ['https://jp.mercari.com/transaction/*'],
});

export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
