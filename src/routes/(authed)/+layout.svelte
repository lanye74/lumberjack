<script lang="ts">
	import NavBar from "$lib/NavBar.svelte";
	import TopBar from "$lib/TopBar.svelte";
</script>

<style>
	.bottom-padding {
		height: calc(8.25rem);
	}
</style>


<TopBar />

<main>
	<slot />
</main>



<div class="bottom-padding"></div>

<NavBar />
