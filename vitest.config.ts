import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        runes: true
      }
    }),
    svelteTesting()
  ],
  resolve: {
    alias: {
      $lib: resolve('./src/lib'),
      '$app/state': resolve('./tests/mocks/app/state'),
      '$app/navigation': resolve('./tests/mocks/app/navigation'),
      $env: resolve('./tests/mocks/env')
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'lcov', 'html'],
      all: true,
      reportsDirectory: './coverage',
      extension: ['.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte'],
      exclude: [
        'node_modules/',
        'tests/',
        'models/',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/setup.ts',
        '**/*.config.ts',
        '**/dist/',
        '**/.svelte-kit/'
      ],
      include: ['src/lib/**/*.{js,ts,svelte}']
    }
  }
});
