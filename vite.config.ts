import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx, defineManifest } from '@crxjs/vite-plugin';

const manifest = defineManifest({
  manifest_version: 3,
  name: 'らくらく再出品',
  version: '1.5',
  options_page: 'index.html',
});

export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
