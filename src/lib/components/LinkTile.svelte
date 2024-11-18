<script lang="ts">
    import type {Snippet} from "svelte";



	type Props = {
		href: string;
		background: string;
		backgroundSize: string;
		backgroundColor?: string;

		children?: Snippet;
	};

	const {
		href,
		background,
		backgroundSize,
		backgroundColor = "var(--jcs-blue)",
		children
	}: Props = $props();
</script>

<style>
	a {
		color: white;
		text-decoration: none;

		position: relative;

		border-radius: 1rem;
		padding: 1.5rem 1rem;
		/* box-shadow: 0 0 1rem #000a inset; */

		font: 600 2.5rem var(--font-serif);

		overflow: hidden;
	}

	a > .background {
		--extra-padding: calc(-1 * var(--background-size));

		position: absolute;
		top: var(--extra-padding);
		left: var(--extra-padding);
		bottom: 0;
		right: 0;
		animation: panBackground 7s infinite linear;
		background-size: var(--background-size) var(--background-size);

		z-index: -10;

		filter: blur(0.1rem);
	}



	@keyframes panBackground {
		from {
			translate: 0 0;
		}

		to {
			translate: var(--background-size) var(--background-size);
		}
	}
</style>



<a {href}>
	<div class="background"
	     style:background-image={`url("${background}")`}
		 style:--background-size={backgroundSize}
		 style:background-color={backgroundColor}></div>

	{@render children?.()}
</a>
