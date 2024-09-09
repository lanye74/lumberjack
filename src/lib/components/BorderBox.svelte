<script lang="ts">
	export let direction: string;
	export let alignItems: string = "normal";
	export let justifyContent: string = "normal";
	export let gap: string = "0";
</script>



<!-- TODO: despite the fact that this is a refactor that's supposed to clean stuff up, i still hate it!
     figure out how to not hate this component! -->
<style>
	section {
		display: flex;

		margin: 2rem;
		padding: 2rem;

		border-radius: 0.25rem;
		border: 0.25rem solid #aaa;

		box-shadow: 0 0.5rem 1rem #0003;
		box-sizing: border-box;
	}
</style>



<section style:flex-direction={direction}
         style:align-items={alignItems}
		 style:justify-content={justifyContent}
		 style:gap={gap}>
	<slot />
</section>
