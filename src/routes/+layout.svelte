<script lang="ts">
	import {invalidate} from "$app/navigation";
	import {onMount} from "svelte";
	import {page} from "$app/stores";

	import {authStateLogPrefix} from "$lib/consoleColorPrefixes.js";
	import {mapRouteToPageTitle} from "$lib/routes.js";



	export let data;
	$: ({session, supabase} = data);


	$: title = mapRouteToPageTitle($page.route.id);



	onMount(() => {
		const {data: {subscription}} = supabase.auth.onAuthStateChange((_authEvent, newSession) => {
			// we just got a session and the server needs to pull it to provide in all future requests
			// (i think)

			console.log(...authStateLogPrefix, newSession === null ? "Logged out" : "Logged in");


			if(newSession?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth");
			}
		});


		return () => subscription.unsubscribe();
	});
</script>

<style>
	:root {
		/* source: it came to me in a dream
		   (just kidding i stole it from https://sjorswijsman.medium.com/3-easy-css-tricks-for-responsive-websites-i-use-in-every-project-68ec334a1522) */
		font-size: clamp(12px, calc(60% + 0.8vmin), 20px);

		--fallback-fonts: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, "Roboto", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
		--font-serif: "Lora", var(--fallback-fonts);
		--font-sans-serif: "Avenir", var(--fallback-fonts);
		--time-font: "Cascadia Code", var(--fallback-fonts);

		--jcs-blue: #003a70;
		--jcs-cyan: #69b3e7;

		--gray-1: #ccc;
		--gray-2: #aaa;
		--gray-3: #888;
		--gray-4: #666;

		--border-color: var(--gray-1);
		--avatar-color: var(--gray-2);
		--subtext-color: var(--gray-4);
	}

	:global(body) {
		margin: 0;
	}

	:global(*) {
		font-family: var(--font-serif);
	}



	@font-face {
		font-family: "Lora";
		src: url("/Lora-Variable.ttf") format("truetype-variations");
		font-weight: 400 700;
	}

	@font-face {
		font-family: "Avenir";
		src: url("/AvenirNext_Variable.ttf") format("truetype-variations");
		font-weight: 400 1000;
	}

	@font-face {
		font-family: "Cascadia Code";
		src: url("/Cascadia-Code-Semibold.ttf") format("truetype");
		font-weight: 600;
	}
</style>

<svelte:head>
	<title>{title}</title>
</svelte:head>



<slot />
