<script lang="ts">
	export let direction: string;
	export let alignItems: string = "normal";
	export let justifyContent: string = "normal";
	export let gap: string = "0";
</script>

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
