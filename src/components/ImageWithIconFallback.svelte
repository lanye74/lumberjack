<script lang="ts">
    import {type IconComponentId, iconComponentMap} from "$lib/icons.js";
	import {onMount} from "svelte";



	export let src: string | null;
	export let alt: string;

	export let iconId: IconComponentId;



	const mappedIcon = iconComponentMap[iconId];



	let isLoading = true;
	let hadError = false;

	let loadedSrc = "";



	onMount(() => {
		const image = new Image();

		if(src === null) {
			isLoading = false;
			hadError = true;
			return;
		}



		image.src = src;

		image.onload = () => {
			isLoading = false;
			hadError = false;
			loadedSrc = src;
		};

		image.onerror = () => {
			isLoading = false;
			hadError = true;
		};
	});
</script>

<style>
	img {
		display: block;

		width: 100%;
		height: 100%;

		border-radius: inherit;
	}
</style>



{#if isLoading || hadError}
	<!-- TODO: why does user-circle take up more height than it's supposed to?
	           I know it's not a 1:1 aspect ratio and is skewed vertically but all the same i need it to scale by height, not width
	           need to take a look at my icon setup -->
	<svelte:component this={mappedIcon} font-size="inherit" color="inherit" style="height: min-content;" />
{:else}
	<img src={loadedSrc} {alt}>
{/if}
