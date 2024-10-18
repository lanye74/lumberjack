import {defineConfig} from "vite";
import Icons from "unplugin-icons/vite";
import {sveltekit} from "@sveltejs/kit/vite";
import {SvelteKitPWA} from "@vite-pwa/sveltekit";

import {readFileSync} from "node:fs";
import path from "node:path";



const manifestPath = path.join(__dirname, "static/manifest.json");
const pwaManifest = JSON.parse(readFileSync(manifestPath, {encoding: "utf8"}))!;

const certDirectory = "C:\\Certbot\\live\\appdev.jessamine.kyschools.us";
const keyFile = path.join(certDirectory, "privkey.pem");
const certFile = path.join(certDirectory, "fullchain.pem");



export default defineConfig(args => {
	// don't read files unless we're actually in deployment
	const preview = args.isPreview ? {
		https: {
			key: readFileSync(keyFile),
			cert: readFileSync(certFile),
		},

		proxy: {} // this is needed for some ungodly reason but it fixes my headaches
	} : undefined;


	return {
		plugins: [
			sveltekit(),
			SvelteKitPWA({...pwaManifest}),
			Icons({compiler: "svelte"}),
		],

		preview
	}
});
