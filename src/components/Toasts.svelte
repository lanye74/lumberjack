<script lang="ts">
	import {flip} from "svelte/animate";
	import {fly} from "svelte/transition";

	import {formattedNavbarHeight, toaster} from "$lib/stores.js";
</script>

<style>
	#toast-container {
		position: fixed;
		bottom: calc(var(--navbar-height) + 4vh);
		right: 0;

		display: flex;
		flex-direction: column-reverse;
		align-items: flex-end;
		gap: 1rem;

		z-index: 30;
	}

	.toast {
		display: flex;
		flex-direction: column;

		background-color: transparent;
		border-radius: 0.5rem;

		max-width: 70vw;

		padding-right: 1rem;
		cursor: pointer;
	}

	.toast-wrapper {
		background-color: white;
		border-radius: inherit;
	}



	.toast h3, .toast p {
		margin: 0;
	}

	.toast h3 {
		font: bold 1.75rem var(--font-serif);
		background-color: var(--jcs-blue);
		color: white;

		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
		border: 0.25rem solid var(--jcs-blue);
		border-bottom: 0;

		padding: 0.25rem 0.75rem;
	}

	.toast p {
		font-size: 1.25rem;
		box-sizing: border-box;

		border-bottom-left-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
		border: 0.25rem solid var(--border-color);
		border-top: none;

		padding: 0.375rem 0.75rem;
	}
</style>



<div id="toast-container" style:--navbar-height={$formattedNavbarHeight}>
	{#each $toaster as toast (toast.id)}
		<!-- TODO: use a button for a11y -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->

		<!-- oh my god using these transitions was so much easier why didn't i do this from the start -->
		<div class="toast"
			aria-live="assertive"
			role="alert"

			in:fly={{x: "100%", duration: 250, opacity: 1}}
			out:fly={{x: "100%", duration: 250, opacity: 0}}
			animate:flip={{duration: 250}}

			on:click={() => toaster.dismiss(toast.id)}
		>
			<div class="toast-wrapper">
				<!-- TODO: possibly put an icon & progress bar here -->
				<h3>Lumberjack</h3>
				<p>{toast.content}</p>
			</div>
		</div>
	{/each}
</div>
