import { defineConfig } from 'vitest/config';

export default defineConfig({
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
