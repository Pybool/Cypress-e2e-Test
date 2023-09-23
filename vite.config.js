/** @type {import('vite').UserConfig} */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

export default defineConfig({
  plugins: [
    // basicSsl(),
    react(),
  ],
  server: {
    port: 3000,
    https: false,
  },
  resolve: {
    alias: [
      {
        find: '@harmony/assets',
        replacement: path.resolve(__dirname, 'src/assets'),
      },
      {
        find: '@harmony/api',
        replacement: path.resolve(__dirname, 'src/api'),
      },
      {
        find: '@harmony/config',
        replacement: path.resolve(__dirname, 'src/config'),
      },
      {
        find: '@harmony/libs',
        replacement: path.resolve(__dirname, 'src/libs'),
      },
      {
        find: '@harmony/data',
        replacement: path.resolve(__dirname, 'src/data'),
      },
      {
        find: '@harmony/atoms',
        replacement: path.resolve(__dirname, 'src/components/atoms'),
      },
      {
        find: '@harmony/hooks',
        replacement: path.resolve(__dirname, 'src/components/hooks'),
      },
      {
        find: '@harmony/molecules',
        replacement: path.resolve(__dirname, 'src/components/molecules'),
      },
      {
        find: '@harmony/organisms',
        replacement: path.resolve(__dirname, 'src/components/organisms'),
      },
      {
        find: '@harmony/templates',
        replacement: path.resolve(__dirname, 'src/components/templates'),
      },
      {
        find: '@harmony/views',
        replacement: path.resolve(__dirname, 'src/views'),
      },
      {
        find: '@harmony/test',
        replacement: path.resolve(__dirname, 'src/test'),
      },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/vitest.setup.js',
    css: true,
    open: false,
    coverage: {
      provider: 'c8',
    },
  },
})
