<script lang="ts">
	import ImageWithIconFallback from "$components/ImageWithIconFallback.svelte";

	import {formatPixels} from "$utils/formatters.js";


	type Props = {
		src: string | null;
		absoluteSize?: string;
		percentageSize?: number;
	};

	const {src, absoluteSize, percentageSize}: Props = $props();


	if(absoluteSize === undefined && percentageSize === undefined) {
		console.error("UserAvatar instantiated with no size!");
	}


	let wrapperWidth = $state(0);

	let iconWidth = absoluteSize ?? `${percentageSize}%`;
	let fontSize = $derived(absoluteSize ?? formatPixels(wrapperWidth))
</script>

<style>
	.image-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;

		border-radius: 50%;
		color: var(--avatar-color);

		width: var(--icon-width);
		font-size: var(--font-size);

		aspect-ratio: 1 / 1;
	}

	/* .image-wrapper:has(img) {
		filter: drop-shadow(0.5rem 0.5rem 1rem #0004);
	} */
</style>



<div class="image-wrapper"
	style:--icon-width={iconWidth}
	style:--font-size={fontSize}
	bind:clientWidth={wrapperWidth}
>
	<ImageWithIconFallback {src} alt="User profile picture" iconId="user-circle" />
</div>
