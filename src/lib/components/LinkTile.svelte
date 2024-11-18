<script lang="ts">
    import type {Snippet} from "svelte";



	type Props = {
		href: string;
		background: string;
		backgroundSize: string;

		children?: Snippet;
	};

	const {href, background, backgroundSize, children}: Props = $props();

	let cssBackground = `url("${background}")`;
</script>

<style>
	a {
		background-color: var(--jcs-blue);
		color: white;
		text-decoration: none;

		position: relative;

		border-radius: 1rem;
		padding: 1rem;

		font: 3rem var(--font-serif);
	}

	a > .background {
		/* --additional-size: calc(-1 * var(--background-size)); */

		position: absolute;
		/* top: var(--additional-size); */
		/* left: var(--additional-size); */
		/* bottom: var(--additional-size); */
		/* right: var(--additional-size); */
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		animation: panBackground 7s infinite linear;
		background-size: var(--background-size);
	}


	/* TODO: make a background element that's translated, since background-position does a bunch of style recalcs */
	@keyframes panBackground {
		from {
			translate: 0 0;
		}

		to {
			translate: var(--background-size);
		}
	}
</style>



<a {href}>
	<div class="background"
	     style:background-image={`url("${background}")`}
		 style:--background-size={backgroundSize}
	></div>

	{@render children?.()}
</a>
