<script lang="ts">
	import ProfileIcon from "virtual:icons/fa-solid/user-circle";

	import {formatPixels} from "$utils/formatters.js";



	export let src: string | null = null;

	// TODO: export an atlasDimensions thing
	export let positionIndex: {x: number, y: number};

	const backgroundPosition = `calc(${positionIndex.x} * calc(100% / 9)) calc(${positionIndex.y} * 100%)`;
	const backgroundSize = "cover";


	export let absoluteSize: string | undefined = undefined;
	export let percentageSize: number | undefined = undefined;

	if(absoluteSize === undefined && percentageSize === undefined) {
		console.error("AvatarFromAtlas instantiated with no size!");
	}


	let wrapperWidth = 0;

	let iconWidth = absoluteSize ?? `${percentageSize}%`;
	$: fontSize = absoluteSize ?? formatPixels(wrapperWidth);


	let isError = false;


	$: {
		isError = (src === null || src === "");
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
	style:background-image={`url("${src}")`}
>
	{#if isError}
		<ProfileIcon />
	{/if}
</div>
