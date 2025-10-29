import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');
  const remoteEntry = env.VITE_REMOTE_APP_URL || 'http://localhost:4173/assets/remoteEntry.js';

  return {
    plugins: [
      react(),
      federation({
        name: 'host_app',
        remotes: {
          
          remote_app: remoteEntry,
        },
        shared: ['react', 'react-dom'],
      }),
    ],
    server: {
      port: Number(env.VITE_HOST_PORT) || 5000,
      cors: true,
    },
    build: {
      target: 'esnext',
    },
  };
});
