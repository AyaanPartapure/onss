import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // Local testing works with the existing Render backend; no server folder required.
  // Set VITE_DEV_API_TARGET=http://localhost:5000 to test your local Express server.
  const backend = env.VITE_DEV_API_TARGET || 'https://onss-evtj.onrender.com';
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': { target: backend, changeOrigin: true, secure: true },
        '/uploads': { target: backend, changeOrigin: true, secure: true },
      },
    },
  };
});
