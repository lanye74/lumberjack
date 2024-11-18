<script lang="ts">
    import type {Snippet} from "svelte";



	type Props = {
		href: string;
		background: string;
		backgroundSize: {x: string, y: string};

		children?: Snippet;
	};

	const {href, background, backgroundSize, children}: Props = $props();
</script>

<style>
	a {
		background-color: var(--jcs-blue);
		color: white;
		text-decoration: none;

		position: relative;

		border-radius: 1rem;
		padding: 1.5rem 1rem;

		font: 600 2.5rem var(--font-serif);

		overflow: hidden;

		/* box-shadow: 0 0 1rem #000a inset; */
		/* border: 0.25rem solid var(--gray-2); */
		/* box-sizing: border-box; */
	}

	a > .background {
		position: absolute;
		top: calc(-1 * var(--background-size-y));
		left: calc(-1 * var(--background-size-x));
		bottom: 0;
		right: 0;
		animation: panBackground 7s infinite linear;
		background-size: var(--background-size-x) var(--background-size-y);
	}



	@keyframes panBackground {
		from {
			translate: 0 0;
		}

		to {
			translate: var(--background-size-x) var(--background-size-y);
		}
	}
</style>



<a {href}>
	<div class="background"
	     style:background-image={`url("${background}")`}
		 style:--background-size-x={backgroundSize.x}
		 style:--background-size-y={backgroundSize.y}></div>
	{@render children?.()}
</a>
