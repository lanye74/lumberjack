<script lang="ts">
	import {onMount} from "svelte";
	import ProfileIcon from "virtual:icons/fa-solid/user-circle";



	export let src: string;
	export let alt: string;

	export let icon: keyof typeof iconComponentMap;



	const iconComponentMap = {
		"user-circle": ProfileIcon
	};

	const mappedIcon = iconComponentMap[icon];



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
</style>



{#if isLoading || hadError}
	<!-- TODO: why does user-circle take up more height than it's supposed to?
	           I know it's not a 1:1 aspect ratio and is skewed vertically but all the same i need it to scale by height, not width
	           need to take a look at my icon setup -->
	<svelte:component this={mappedIcon} font-size="inherit" color="inherit" style="height: min-height;" />
{:else}
	<img src={loadedSrc} {alt}>
{/if}
