<script lang="ts">
	import {formatPixels} from "$lib/formatters.js";
	import ImageWithIconFallback from "./ImageWithIconFallback.svelte";



	export let src: string;

	export let absoluteSize: string | undefined = undefined;
	export let percentageSize: number | undefined = undefined;

	if(absoluteSize === undefined && percentageSize === undefined) {
		console.error("UserAvatar instantiated with no size!");
	}


	let wrapperWidth = 0;


	let iconWidth = absoluteSize ?? `${percentageSize}%`;
	let iconHeight = absoluteSize ?? "unset";
	$: fontSize = absoluteSize ?? `${formatPixels(wrapperWidth)}px`;
</script>

<style>
	.image-wrapper {
		display: flex;
		justify-content: center;

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
	<ImageWithIconFallback {src} alt="User profile picture" icon="fa-solid:user-circle" />
</div>
