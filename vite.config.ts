import {sveltekit} from "@sveltejs/kit/vite";
import {defineConfig} from "vite";
import {SvelteKitPWA} from "@vite-pwa/sveltekit";

import {readFileSync} from "fs";
import path from "path";



const manifestPath = path.join(__dirname, "static/manifest.json");
const pwaManifest = JSON.parse(readFileSync(manifestPath, {encoding: "utf8"}))!;



export default defineConfig({
	plugins: [
		sveltekit(),
		// @ts-ignore
		SvelteKitPWA({...pwaManifest})
	],

	preview: {
		https: {
			key: readFileSync("C:\\Certbot\\live\\appdev.jessamine.kyschools.us\\privkey.pem"),
			cert: readFileSync("C:\\Certbot\\live\\appdev.jessamine.kyschools.us\\fullchain.pem"),
		},

		proxy: {} // this is needed for some ungodly reason but it fixes my headaches
	}
});
