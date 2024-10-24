<script lang="ts">
    import ImageWithIconFallback from "$components/ImageWithIconFallback.svelte";

    import {formatPixels} from "$utils/formatters.js";



	export let src: string | null = null;

	// TODO: export an atlasDimensions thing
	export let positionIndex: {x: number, y: number};
	const backgroundPosition = `calc(${positionIndex.x} * calc(100% / 9)) calc(${positionIndex.y} * 100%)`;
	// const backgroundSize = `${dimensions.x}px ${dimensions.y}px`;
	const backgroundSize = "cover";


	export let absoluteSize: string | undefined = undefined;
	export let percentageSize: number | undefined = undefined;

	if(absoluteSize === undefined && percentageSize === undefined) {
		console.error("AvatarFromAtlas instantiated with no size!");
	}


	let wrapperWidth = 0;


	let iconWidth = absoluteSize ?? `${percentageSize}%`;
	let iconHeight = absoluteSize ?? "unset";
	$: fontSize = absoluteSize ?? formatPixels(wrapperWidth);
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
</style>



<div class="image-wrapper"
	style:--icon-width={iconWidth}
	style:--icon-height={iconHeight}
	style:--font-size={fontSize}
	bind:clientWidth={wrapperWidth}

	style:background-position={backgroundPosition}
	style:background-size={backgroundSize}
	style:background-image={`url('${src}')`}
>
	<!-- <ImageWithIconFallback {src} alt="User profile picture" iconId="user-circle" /> -->
</div>
