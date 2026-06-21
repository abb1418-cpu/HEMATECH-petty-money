import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' يجعل المسارات نسبية لتعمل على GitHub Pages تحت أي اسم مستودع
export default defineConfig({
  plugins: [react()],
  base: './'
});
