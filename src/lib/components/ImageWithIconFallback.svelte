<script lang="ts">
	import {onMount} from "svelte";

	import {type IconComponentId, iconComponentMap} from "$utils/icons.js";



	type Props = {
		src: string | null;
		alt: string;

		iconId: IconComponentId;
	};

	// TODO: rename this to "inputSrc" or something
	const {src, alt, iconId}: Props = $props();

	const IconFallback = iconComponentMap[iconId];



	let isLoading = $state(true);
	let hadError = $state(false);

	let loadedSrc = $state("");


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
	<IconFallback font-size="inherit" color="inherit" />
{:else}
	<img src={loadedSrc} {alt}>
{/if}
