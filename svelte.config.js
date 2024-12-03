import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			},
			platformProxy: {
				environment: undefined,
				experimentalJsonConfig: false,
				persist: false
			}
		}),
    alias: {
      $components: path.resolve('./src/lib/components'),
      $models: path.resolve('./src/lib/models'),
      $utils: path.resolve('./src/lib/utils'),
      '~': path.resolve('./src')
    },
    version: {
      name: pkg.version
    }
  }
};

export default config;
