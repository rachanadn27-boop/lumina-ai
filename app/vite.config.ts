import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import path from 'path'

// Shared rollup config for Electron main/preload — output CommonJS
// so __dirname/__filename are available at runtime (ESM doesn't have them).
const electronRollupOptions = {
  output: {
    format: 'cjs' as const,
  },
  external: ['electron', 'sqlite3', 'sqlite'],
}

export default defineConfig({
  // CRITICAL: base must be './' so assets use relative paths.
  // When Electron loads the app via loadFile() (file:// protocol),
  // absolute paths like /assets/index.js will NOT resolve.
  base: './',

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
            rollupOptions: electronRollupOptions,
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
            rollupOptions: electronRollupOptions,
          },
        },
      },
    ]),
    renderer(),
  ],
})
