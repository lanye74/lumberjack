import {defineConfig, type PluginOption} from "vite";

import {visualizer as pluginBundleVisualizer} from "rollup-plugin-visualizer";
import {SvelteKitPWA as pluginPWA} from "@vite-pwa/sveltekit";
import {sveltekit as pluginSvelteKit} from "@sveltejs/kit/vite";
import pluginUnpluginIcons from "unplugin-icons/vite";

import {readFileSync} from "node:fs";
import path from "node:path";




export default defineConfig(args => {
	const isDebug = false;


	return {
		plugins: getPlugins(isDebug),
		preview: getPreviewOptions(args.isPreview, isDebug)
	}
});



function getPlugins(isDebug: boolean) {
	const manifestPath = path.join(__dirname, "static/manifest.json");
	const pwaManifest = JSON.parse(readFileSync(manifestPath, {encoding: "utf8"}))!;


	const plugins: PluginOption[] = [
		pluginSvelteKit(),
		pluginPWA({...pwaManifest}),
		pluginUnpluginIcons({compiler: "svelte"})
	];


	if(isDebug) {
		plugins.push(pluginBundleVisualizer({
			emitFile: true,
			template: "flamegraph"
		}));
	}


	return plugins;
}



function getPreviewOptions(isPreview: boolean | undefined, isDebug: boolean) {
	// don't read files unless we're actually in deployment
	if(isDebug || !isPreview) return undefined;


	const certDirectory = "C:\\Certbot\\live\\appdev.jessamine.kyschools.us";
	const keyFilePath = path.join(certDirectory, "privkey.pem");
	const certFilePath = path.join(certDirectory, "fullchain.pem");


	return {
		https: {
			key: readFileSync(keyFilePath),
			cert: readFileSync(certFilePath),
		},

		proxy: {} // this is needed for some ungodly reason but it fixes my headaches
	};
}
