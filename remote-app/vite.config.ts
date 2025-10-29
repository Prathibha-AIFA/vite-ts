import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.VITE_REMOTE_PORT) || 5001;
  const origin = env.VITE_REMOTE_ORIGIN || `http://localhost:${port}`;

  return {
    plugins: [
      react(),
      federation({
        name: 'remote_app',
        filename: 'remoteEntry.js',
        exposes: {
          './RemoteButton': './src/RemoteButton.tsx',
        },
        shared: ['react', 'react-dom'],
      }),
    ],
    build: {
      target: 'esnext',
    },
    server: {
      port,
      strictPort: true,
      cors: true,
      origin,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    },
  };
});
