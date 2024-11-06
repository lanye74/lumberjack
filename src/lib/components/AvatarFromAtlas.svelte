<script lang="ts">
	import {formatPixels} from "$utils/formatters.js";
    import {iconComponentMap} from "$utils/icons.js";



	const ProfileIcon = iconComponentMap["user-circle"];



	type Props = {
		src: string | null;
		positionIndex: {x: number, y: number};
		atlasTiles: {x: number, y: number};
		hasError?: boolean;

		absoluteSize?: string;
		percentageSize?: number;
	};

	const {
		src,
		positionIndex,
		atlasTiles,
		hasError = false,

		// TODO: should these have defaults of undefined?
		// that is redundant, yes? i'm not crazy?
		absoluteSize,
		percentageSize
	}: Props = $props();



	const backgroundXTransform = `calc(${positionIndex.x} * calc(100% / ${Math.max(atlasTiles.x - 1, 1)}))`;
	const backgroundYTransform = `calc(${positionIndex.y} * calc(100% / ${Math.max(atlasTiles.y - 1, 1)}))`;

	const backgroundPosition = `${backgroundXTransform} ${backgroundYTransform}`;
	const backgroundSize = "cover";



	if(absoluteSize === undefined && percentageSize === undefined) {
		console.error("AvatarFromAtlas instantiated with no size!");
	}


	let wrapperWidth = $state(0);

	// TODO: rename this property
	let iconWidth = absoluteSize ?? `${percentageSize}%`;
	let fontSize = $derived(absoluteSize ?? formatPixels(wrapperWidth));


	let internalIsError = $derived(src === null || src === "" || hasError);
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
