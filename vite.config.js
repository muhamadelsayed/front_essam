// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 1. الرابط الثابت للإنتاج (Hardcoded URL)
// هذا هو المكان الوحيد الذي تحتاج فيه إلى كتابة رابط Railway.
const backendUrl = 'https://khamsatessam-production-9ef9.up.railway.app'; 

export default defineConfig({
  plugins: [react()],

  // 2. إعدادات خادم التطوير المحلي
  server: {
    // البروكسي يقوم بتوجيه طلبات /api من localhost:5173 إلى localhost:5000
    // هذا يعمل فقط عند تشغيل `npm run dev` ومع المسارات النسبية
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    },
  },

  // 3. تعريف المتغيرات العامة
  define: {
    // **هذا للمسارات (API routes)**
    // سيكون سلسلة فارغة في التطوير (لتفعيل البروكسي)
    // وسيكون رابط Railway الكامل في الإنتاج
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
      process.env.NODE_ENV === 'production' 
        ? backendUrl 
        : 'http://localhost:5000' 
    ),
    
    // **وهذا للملفات (الصور)**
    // سيكون http://localhost:5000 في التطوير
    // وسيكون رابط Railway الكامل في الإنتاج
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify(
      process.env.NODE_ENV === 'production'
        ? backendUrl
        : 'http://localhost:5000'
    )
  },
});