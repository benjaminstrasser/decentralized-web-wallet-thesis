import { sveltekit } from '@sveltejs/kit/vite';
import nodePolyfills from 'vite-plugin-node-stdlib-browser'
import inject from '@rollup/plugin-inject'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    inject({
      modules: { Buffer: ['buffer', 'Buffer'] }
    }),
   nodePolyfills()]
};

export default config;
