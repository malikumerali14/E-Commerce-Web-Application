// vite.config.js (Example for a React project)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // You must install this plugin

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["c66ir4nqsepu.share.zrok.io"],
    host: '0.0.0.0',

    // This tells the browser to connect back to the tunnel's HTTPS port (443)
    hmr: {
      clientPort: 443,
      protocol: 'wss',
    },

  },
});