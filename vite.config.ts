import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    paraglide({
      project: './project.inlang',
      outdir: './src/lib/paraglide'
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      host: 'localhost'
    },
  },
});
