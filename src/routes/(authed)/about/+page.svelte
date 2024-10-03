<script lang="ts">
	import BorderBox from "$components/BorderBox.svelte";



	const attributes: any[] = [];
</script>

<style>
	h2, p {
		margin: 0;
	}

	h2 {
		font: bold 2.5rem var(--font-serif);
	}

	p {
		font: italic 1.5rem var(--font-serif);
		white-space: pre-wrap;
	}

	img {
		width: 6rem;
		border-radius: 50%;
	}

	.attribute {
		padding: 1.25rem 2rem;
		box-sizing: border-box;

		border-bottom: 0.25rem solid var(--border-color);
	}

	.attribute:first-child {
		border-top: 0.25rem solid var(--border-color);
	}

	.attribute:last-child {
		border-bottom: none;
	}

</style>



<!-- TODO: finish this -->

<BorderBox direction="row" alignItems="center" gap="1.5rem">
	<img src="/icons/lumberjack-512-circle-padded.png" alt="Lumberjack logo">
</BorderBox>


{#each attributes as attribue}
	<div class="attribute"><p>{attribue.text}</p></div>
{/each}
