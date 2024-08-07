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
		/* source: it came to me in a dream
		   (just kidding i stole it from https://sjorswijsman.medium.com/3-easy-css-tricks-for-responsive-websites-i-use-in-every-project-68ec334a1522) */
		font-size: clamp(12px, calc(60% + 0.8vmin), 20px);

		--jcs-blue: #003a71;
	}

	:global(body) {
		margin: 0;
	}

	:global(*) {
		font-size: 1rem;
	}



	@font-face {
		font-family: "Lora";
		src: url("/Lora-Regular.ttf") format("truetype");
		font-weight: normal;
	}

	@font-face {
		font-family: "Lora";
		src: url("/Lora-Bold.ttf") format("truetype");
		font-weight: bold;
	}
</style>





<slot />
