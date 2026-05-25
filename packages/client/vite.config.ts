import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: Number(process.env.CLIENT_PORT) || 3000,
  },
  define: {
    __EXTERNAL_SERVER_URL__: JSON.stringify(process.env.EXTERNAL_SERVER_URL),
    __INTERNAL_SERVER_URL__: JSON.stringify(process.env.INTERNAL_SERVER_URL),
  },
  build: {
    outDir: path.join(__dirname, 'dist/client'),
  },
  ssr: {
    noExternal: ['react-helmet-async'],
  },
  resolve: {
    // alias: {
    //   'react-helmet-async': path.join(
    //     __dirname,
    //     '../../node_modules/react-helmet-async/lib/index.js'
    //   ),
    // },
  },
  plugins: [react()],
});
