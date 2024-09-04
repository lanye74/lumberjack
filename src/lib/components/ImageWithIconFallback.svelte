<script lang="ts">
	import "iconify-icon";
	import {onMount} from "svelte";



	export let src: string;
	export let alt: string;

	export let iconId: string;


	let isLoading = true;
	let hadError = false;

	let loadedSrc = "";



	onMount(() => {
		const image = new Image();
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

	iconify-icon {
		font-size: inherit;
		color: inherit;
	}
</style>



{#if isLoading || hadError}
	<iconify-icon class={$$props.class} icon={iconId} />
{:else}
	<img src={loadedSrc} {alt}>
{/if}
