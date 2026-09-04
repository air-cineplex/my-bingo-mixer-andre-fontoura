import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Auto-detect base path from environment (GitHub Actions sets VITE_REPO_NAME)
  base: process.env.VITE_REPO_NAME ? `/${process.env.VITE_REPO_NAME}/game/` : '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
    watch: false,
  },
})
