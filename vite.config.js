// client/vite.config.js
import { defineConfig, loadEnv } from 'vite'; // **الخطوة 1: استيراد loadEnv**
import react from '@vitejs/plugin-react';

// **الخطوة 2: تغيير طريقة تصدير الإعدادات إلى دالة**
// هذا يسمح لنا بالوصول إلى 'mode' (الوضع الحالي: 'production' أو 'development')
export default defineConfig(({ mode }) => {
  
  // **الخطوة 3: تحميل متغيرات البيئة الخاصة بالوضع الحالي**
  // process.cwd() يشير إلى المجلد الحالي (client)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],

    // إعدادات خادم التطوير المحلي (تبقى كما هي)
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        }
      },
    },

    // **الخطوة 4: استخدام المتغيرات التي تم تحميلها**
    define: {
      // هذا للمسارات (API routes)
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
        mode === 'production' 
          ? env.VITE_BACKEND_URL_PROD // **<-- يقرأ من ملف .env**
          : '' // **مهم: يبقى فارغًا في التطوير لتفعيل البروكسي**
      ),
      
      // وهذا للملفات الثابتة (الصور والفيديوهات)
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(
        mode === 'production'
          ? env.VITE_BACKEND_URL_PROD // **<-- يقرأ من ملف .env**
          : 'http://localhost:5000' // الرابط المباشر للخادم المحلي
      )
    },
  };
});