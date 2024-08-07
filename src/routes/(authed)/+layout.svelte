<script lang="ts">
	import NavBar from "$lib/NavBar.svelte";
    import TopBar from "$lib/TopBar.svelte";
</script>

<style>
	main {
		padding: 2rem;
	}
</style>



<TopBar />

<main>
	<slot />
</main>

<NavBar />
