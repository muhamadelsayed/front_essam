// client/vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
        mode === 'production' 
          ? env.VITE_BACKEND_URL_PROD 
          : '' // <-- القيمة الصحيحة: نص فارغ
      ),
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(
        mode === 'production'
          ? env.VITE_BACKEND_URL_PROD
          : '' // <-- القيمة الصحيحة: نص فارغ
      )
    },
  };
});