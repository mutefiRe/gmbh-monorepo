import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'


// https://vite.dev/config/
export default defineConfig({
  plugins: [mkcert({}), react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true
    },
    manifest: {
      name: 'GmbH Waiter v2',
      short_name: 'GmbH Waiter',
      description: 'GmbH Waiter Application',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/index.html',
    }
  })],
  server: {
    https: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/authenticate": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/global.scss";`
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
