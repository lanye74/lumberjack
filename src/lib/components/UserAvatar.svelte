<script lang="ts">
	import ImageWithIconFallback from "$components/ImageWithIconFallback.svelte";

	import {formatPixels} from "$utils/formatters.js";



	export let src: string | null;

	export let absoluteSize: string | undefined = undefined;
	export let percentageSize: number | undefined = undefined;

	if(absoluteSize === undefined && percentageSize === undefined) {
		console.error("UserAvatar instantiated with no size!");
	}


	let wrapperWidth = 0;


	let iconWidth = absoluteSize ?? `${percentageSize}%`;
	$: fontSize = absoluteSize ?? formatPixels(wrapperWidth);
	$: iconHeight = absoluteSize ?? fontSize;
</script>

<style>
	.image-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;

		border-radius: 50%;
		color: var(--avatar-color);

		width: var(--icon-width);
		height: var(--icon-height);
		font-size: var(--font-size);
	}

	/* .image-wrapper:has(img) {
		filter: drop-shadow(0.5rem 0.5rem 1rem #0004);
	} */
</style>



<div class="image-wrapper"
	style:--icon-width={iconWidth}
	style:--icon-height={iconHeight}
	style:--font-size={fontSize}
	bind:clientWidth={wrapperWidth}
>
	<ImageWithIconFallback {src} alt="User profile picture" iconId="user-circle" />
</div>
