import adapter from "@sveltejs/adapter-node";
import {vitePreprocess} from "@sveltejs/vite-plugin-svelte";



/** @type {import("@sveltejs/kit").Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),

		alias: {
			"$components": "src/lib/components/",
			"$types": "src/lib/types/",
			"$utils": "src/lib/utils/"
		},

		version: {
			pollInterval: 10000
		}
	}
};



export default config;
