<script lang="ts">
    import type {Snippet} from "svelte";



	type Props = {
		href: string;
		background: string;
		children?: Snippet;
	};

	const {href, background, children}: Props = $props();

	let cssBackground = `url("${background}")`;
</script>

<style>
	a {
		background-color: var(--jcs-blue);
		color: white;

		border-radius: 1rem;
		padding: 1rem;

		font: 3rem var(--font-serif);

		background-image: url("/tiles/trophy.svg");
		background-size: 4rem 4rem;

		text-decoration: none;

		animation: panBackground 7s infinite linear;
	}


	/* TODO: make a background element that's translated, since background-position does a bunch of style recalcs */
	@keyframes panBackground {
		from {
			background-position: 0 0;
		}

		to {
			background-position: 4rem 4rem;
		}
	}
</style>



<a {href} style:background-image={cssBackground}>
	{@render children?.()}
</a>
