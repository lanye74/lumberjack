<script lang="ts">
	import {invalidate} from "$app/navigation";
	import {onMount} from "svelte";
	import {page} from "$app/state";

	import Toasts from "$components/Toasts.svelte";

	import {mapRouteToPageTitle} from "$utils/routing/routes.js";

	// could use the static 600 weight here, but that's 17.4kb versus dynamic serving 29.1kb.
	// i care about optimizing delivery a lot—see AAG, written to cut ~300kb down to ~40—
	// but i'm really not losing sleep over 12kb for the mildly easier development experience
	// meh. maybe i should care more.
	import "@fontsource-variable/cascadia-mono";
	import "@fontsource-variable/lora";

	import "$globalStyles/authed.css";



	let {data, children} = $props();

	let {session, supabase} = $derived(data);
	let title = $derived(mapRouteToPageTitle(page.route.id));


	onMount(() => {
		const {data: {subscription: {unsubscribe}}} = supabase.auth.onAuthStateChange((_authEvent, newSession) => {
			// we just got a session and the server needs to pull it to provide in all future requests
			// (i think)

			if(newSession?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth");
			}
		});


		return unsubscribe;
	});
</script>



<svelte:head>
	<title>{title}</title>
</svelte:head>



{@render children()}



<Toasts />
