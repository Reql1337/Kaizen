import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Using relative base for absolute portability on GitHub Pages
  base: './',
  plugins: [react()],
});
