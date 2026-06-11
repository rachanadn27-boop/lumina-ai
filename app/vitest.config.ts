import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      // Path alias matching tsconfig paths
      '@': path.resolve(__dirname, './src'),
      // Mock `electron` with a lightweight stub so main-process
      // code can be imported in Node-only Vitest environment
      'electron': path.resolve(__dirname, 'tests/__mocks__/electron.ts'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/unit/**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'dist', 'dist-electron', 'tests/e2e/**/*'],
    // Suppress "The CJS build of Vite's Node API is deprecated" warning
    reporters: ['verbose'],
  },
})
