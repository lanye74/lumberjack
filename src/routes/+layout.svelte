<script lang="ts">
	import {invalidate} from "$app/navigation";
	import {onMount} from "svelte";



	export let data;

	$: ({session, supabase} = data);


	onMount(() => {
		const {data} = supabase.auth.onAuthStateChange((_authEvent, newSession) => {
			// we just got a session and the server needs to pull it to provide in all future requests
			// (i think)
			if(newSession?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth");
			}
		});


		return () => data.subscription.unsubscribe();
	});
</script>



<slot />
