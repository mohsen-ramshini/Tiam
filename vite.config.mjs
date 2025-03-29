import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(() => {
  const PORT = 3000;

  return {
    server: {
      open: true, // باز شدن خودکار مرورگر هنگام شروع سرور
      port: PORT, // تنظیم پورت پیش‌فرض
      host: true,
      proxy: {
        '/api': {
          target: 'http://37.152.183.111:8000', // آدرس سرور بک‌اند
          changeOrigin: true,
          secure: false, // اگر از HTTPS استفاده نمی‌کنید
          rewrite: (path) => path.replace(/^\/api/, '') // حذف /api از مسیر درخواست
        }
      }
    },
    preview: {
      open: true,
      host: true
    },
    define: {
      global: 'window' // برای پشتیبانی از بسته‌هایی که از global استفاده می‌کنند
    },
    resolve: {
      alias: {
        '@': '/src', // استفاده از @ به‌جای مسیرهای طولانی در importها
        assets: '/src/assets' // مسیر مستقیم برای assets
      }
    },
    plugins: [react(), jsconfigPaths()]
  };
});
