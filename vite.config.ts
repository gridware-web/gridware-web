/* eslint-disable no-unused-vars */
import autoprefixer from 'autoprefixer';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import vueDevTools from "vite-plugin-vue-devtools";


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@analyze': path.resolve(__dirname, 'src/components/analyze'),
      '@convert': path.resolve(__dirname, 'src/components/convert'),
      '@widgets': path.resolve(__dirname, 'src/components/widgets'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [NaiveUiResolver()],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
    legacy({
      targets: [
        'Android >= 39',
        'Chrome >= 50',
        'Safari >= 10.1',
        'iOS >= 10.3',
        '> 1%',
      ],
    }),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeManifestIcons: true,
      includeAssets: ['favicon/*.png'],
      manifest: {
        name: 'GridWare Web',
        short_name: 'GridWareWeb',
        description: 'GridWare, but online',
        lang: 'en-US',
        theme_color: '#fff',
        icons: [
          {
            src: '/favicon/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: '/favicon/maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/favicon/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicon/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(png|jpe?g|svg|gif|webp|ico)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'image-cache',
            },
          },
          {
            urlPattern: /(.*?)\.(js|css|json)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'asset-cache',
              networkTimeoutSeconds: 5,
            },
          },
        ],
      },
      // uncomment to unregister service worker
      selfDestroying: true,
    }),
    vueDevTools(),
    // viteCompression(),
    // visualizer({
    //   title: 'GridWare Web',
    //   template: 'treemap',
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
  ],
  build: {
    emptyOutDir: true,
  },
});
