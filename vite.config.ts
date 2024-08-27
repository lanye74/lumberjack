import {sveltekit} from "@sveltejs/kit/vite";
import {defineConfig} from "vite";

import {readFileSync} from "fs";



export default defineConfig({
	plugins: [sveltekit()],

	preview: {
		https: {
			key: readFileSync("C:\\Certbot\\live\\appdev.jessamine.kyschools.us\\privkey.pem"),
			cert: readFileSync("C:\\Certbot\\live\\appdev.jessamine.kyschools.us\\fullchain.pem"),
		},

		proxy: {} // this is needed for some ungodly reason but it fixes my headaches
	}
});
