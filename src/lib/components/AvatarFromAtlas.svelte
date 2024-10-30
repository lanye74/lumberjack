<script lang="ts">
	import ProfileIcon from "virtual:icons/fa-solid/user-circle";

	import {formatPixels} from "$utils/formatters.js";



	export let src: string | null = null;

	// TODO: export an atlasDimensions thing
	export let positionIndex: {x: number, y: number};
	export let atlasTiles: {x: number, y: number};

	export let hasError: boolean = false;


	const backgroundXTransform = `calc(${positionIndex.x} * calc(100% / ${Math.max(atlasTiles.x - 1, 1)}))`;
	const backgroundYTransform = `calc(${positionIndex.y} * calc(100% / ${Math.max(atlasTiles.y - 1, 1)}))`;


	const backgroundPosition = `${backgroundXTransform} ${backgroundYTransform}`;
	const backgroundSize = "cover";


	export let absoluteSize: string | undefined = undefined;
	export let percentageSize: number | undefined = undefined;

	if(absoluteSize === undefined && percentageSize === undefined) {
		console.error("AvatarFromAtlas instantiated with no size!");
	}


	let wrapperWidth = 0;

	// TODO: rename this property
	let iconWidth = absoluteSize ?? `${percentageSize}%`;
	$: fontSize = absoluteSize ?? formatPixels(wrapperWidth);


	let internalIsError = false;


	$: {
		internalIsError = (src === null || src === "" || hasError);
	}
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

		/* whatever */
		aspect-ratio: 1 / 1;
	}



	:global(.image-wrapper svg) {
		height: min-content;
	}
</style>



<div class="image-wrapper"
	style:--icon-width={iconWidth}
	style:--font-size={fontSize}
	bind:clientWidth={wrapperWidth}

	style:background-position={backgroundPosition}
	style:background-size={backgroundSize}
	style:background-image={internalIsError ? "none" : `url("${src}")`}
>
	{#if internalIsError}
		<ProfileIcon />
	{/if}
</div>
