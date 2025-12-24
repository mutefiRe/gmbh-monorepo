import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_TARGET || "http://localhost:8080";
  const basePath = env.VITE_BASE || process.env.VITE_BASE || "/admin/";
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const shouldRedirect = normalizedBase !== "/";

  return {
    base: normalizedBase,
    server: {
      port: 3000,
      http: true,
      open: normalizedBase,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        "/authenticate": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        "/socket.io": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          ws: true
        }
      }
    },
    plugins: [
      {
        name: 'admin-base-redirect',
        configureServer(server) {
          if (!shouldRedirect) return;
          server.middlewares.use((req, res, next) => {
            const url = req.url || '';
            if (url === '/' || url === '') {
              res.statusCode = 302;
              res.setHeader('Location', normalizedBase);
              res.end();
              return;
            }
            if (url === normalizedBase.slice(0, -1)) {
              res.statusCode = 301;
              res.setHeader('Location', normalizedBase);
              res.end();
              return;
            }
            next();
          });
        }
      },
      react(),
      tailwindcss(),
      legacy({
        targets: ['chrome >= 37', 'android >= 5'],
        modernPolyfills: true,
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
