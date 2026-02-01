import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'lcov'],
    reportsDirectory: 'coverage',
    all: true,
    include: ['src/**/*.{ts,tsx}'],
  },
});

