// client/vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Vite لا يقوم بتحميل .env تلقائيًا في هذا الملف، لذا نستخدم loadEnv
export default defineConfig(({ mode }) => {
  // mode هو 'development' عند تشغيل `npm run dev` و 'production' عند `npm run build`
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        // البروكسي سيعتمد على الرابط من ملف .env
        '/api': {
          target: env.VITE_BACKEND_URL_DEV,
          changeOrigin: true,
        },
        '/uploads': { // أبقِ هذا البروكسي للصور في بيئة التطوير
          target: env.VITE_BACKEND_URL_DEV,
          changeOrigin: true,
        }
      },
    },
    // حقن المتغيرات في كود الواجهة الأمامية
    define: {
      // **الإصلاح هنا: لم نعد بحاجة لـ process.env.NODE_ENV**
      // Vite يعطينا 'mode' الذي يحدد البيئة بشكل أفضل
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
        mode === 'production'
          ? env.VITE_BACKEND_URL_PROD  // استخدم رابط الإنتاج
          : ''                          // استخدم البروكسي في التطوير
      ),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
        mode === 'production'
          ? env.VITE_BACKEND_URL_PROD  // رابط كامل للصور
          : env.VITE_BACKEND_URL_DEV   // رابط محلي للصور
      ),
    },
  };
});