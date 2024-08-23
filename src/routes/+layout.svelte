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

		--fallback-fonts: BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-sans;
		--font-serif: "Lora", var(--fallback-fonts);
		--font-sans-serif: "Avenir", var(--fallback-fonts);
		--time-font: "Cascadia Code", var(--fallback-fonts);

		--jcs-blue: #003a70;
		--jcs-cyan: #69b3e7;
	}

	:global(body) {
		margin: 0;
	}

	:global(*) {
		font: 1rem var(--font-serif);
	}



	@font-face {
		font-family: "Lora";
		src: url("/Lora-Variable.ttf") format("truetype-variations");
	}

	@font-face {
		font-family: "Avenir";
		src: url("/AvenirNext_Variable.ttf") format("truetype-variations");
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
