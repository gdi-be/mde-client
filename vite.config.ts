import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => ({
  plugins: mode === 'test' ? [svelte(), svelteTesting()] : [sveltekit()],

  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      host: 'localhost'
    }
  },

  resolve: {
    alias:
      mode === 'test'
        ? {
            $lib: resolve('./src/lib'),
            '$app/state': resolve('./tests/mocks/app/state'),
            '$app/navigation': resolve('./tests/mocks/app/navigation'),
            $env: resolve('./tests/mocks/env'),
            'svelte-french-toast': resolve('./tests/mocks/svelte-french-toast.ts')
          }
        : undefined
  },

  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/',
        'src/lib/i18n/',
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
}));
