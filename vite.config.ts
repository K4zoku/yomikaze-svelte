import { sveltekit } from '@sveltejs/kit/vite';
import { multicssclass } from 'svelte-multicssclass';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [multicssclass(), sveltekit()]
});
