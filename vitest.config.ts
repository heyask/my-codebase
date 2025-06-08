import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'apps/frontend/specs/**/*.spec.{ts,tsx,js,jsx}',
      'shared/lib/src/**/*.spec.{ts,tsx,js,jsx}',
      'shared/ui/src/**/*.spec.{ts,tsx,js,jsx}'
    ],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@my-codebase/lib/utils': resolve(__dirname, 'shared/lib/src/utils'),
      '@my-workspace/lib/utils': resolve(__dirname, 'shared/lib/src/utils'),
      '@my-codebase/ui/': resolve(__dirname, 'shared/ui/src/') + '/',
      'server-only': fileURLToPath(new URL('./vitest.empty-module.js', import.meta.url)),
    },
  },
}); 