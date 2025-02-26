<script lang="ts">
	import {invalidate} from "$app/navigation";
	import {onMount} from "svelte";
	import {page} from "$app/state";

	import Toasts from "$components/Toasts.svelte";

	import {mapRouteToPageTitle} from "$utils/routing/routes.js";

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
