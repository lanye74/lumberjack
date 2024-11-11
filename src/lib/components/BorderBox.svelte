<script lang="ts">
	import type {Snippet} from "svelte";



	type AlignItemsValues = "start" | "center" | "end" | "normal";
	type JustifyContentValues = AlignItemsValues | "space-between" | "space-around" | "space-evenly";

	type Props = {
		direction: "row" | "column";
		alignItems?: AlignItemsValues;
		justifyContent?: JustifyContentValues;
		gap?: string;

		children: Snippet;
	};

	const {
		direction,
		alignItems = "normal",
		justifyContent = "normal",
		gap = "0",

		children
	}: Props = $props();
</script>

<style>
	section {
		display: flex;

		margin: 2rem;
		padding: 2rem;

		border-radius: 0.25rem;
		border: 0.25rem solid var(--gray-2);

		box-shadow: 0 0.5rem 1rem #0003;
		box-sizing: border-box;
	}
</style>



<section style:flex-direction={direction}
         style:align-items={alignItems}
         style:justify-content={justifyContent}
         style:gap={gap}>
	{@render children()}
</section>
