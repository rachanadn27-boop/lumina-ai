import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    electron([
      {
        // Electron Main process entry
        entry: 'src/main/index.ts',
        vite: {
          build: {
            outDir: 'dist-electron/main',
            minify: false,
          },
        },
      },
      {
        // Preload script entry
        entry: 'src/main/preload.ts',
        vite: {
          build: {
            outDir: 'dist-electron/main',
            minify: false,
          },
        },
      },
    ]),
    renderer(),
  ],
})
