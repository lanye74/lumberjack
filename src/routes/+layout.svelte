<script lang="ts">
    import {authStateLogPrefix} from "$lib/consoleColorPrefixes.js";
	import {invalidate} from "$app/navigation";
	import {onMount} from "svelte";



	export let data;

	$: ({session, supabase} = data);


	onMount(() => {
		const {data} = supabase.auth.onAuthStateChange((_authEvent, newSession) => {
			// we just got a session and the server needs to pull it to provide in all future requests
			// (i think)

			console.log(...authStateLogPrefix, newSession === null ? "Logged out" : "Logged in");


			if(newSession?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth");
			}
		});


		return () => data.subscription.unsubscribe();
	});
</script>

<style>
	:root {
		/* source: it came to me in a dream */
		font-size: clamp(14px, 80% + 0.5vmin, 20px);
	}

	:global(body) {
		margin: 0;
	}

	:global(*) {
		font-size: 1rem;
	}

	:global(h1) {
		font-size: 2.2rem;
	}
</style>



<slot />
