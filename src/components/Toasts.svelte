<script lang="ts">
	import {flip} from "svelte/animate";
	import {fly} from "svelte/transition";

	import {formattedNavbarHeight, toaster} from "$lib/stores.js";
</script>

<style>
	#toasts-container {
		position: fixed;
		bottom: calc(var(--navbar-height) + 4vh);
		right: 0;

		display: flex;
		flex-direction: column-reverse;
		align-items: flex-end;
		gap: 1rem;

		z-index: 30;

		/* TODO: how to properly exempt this from page transitions? */
		view-transition-name: toast-container;
	}

	.toast-wrapper {
		display: flex;
		flex-direction: column;

		background-color: transparent;
		border-radius: 0.5rem;

		max-width: 70vw;

		padding-right: 1rem;
		cursor: pointer;
	}



	.toast-content {
		background-color: white;
		border-radius: inherit;
	}

	.toast-content h3, .toast-content p {
		margin: 0;
	}

	.toast-content h3 {
		font: bold 1.75rem var(--font-serif);
		background-color: var(--jcs-blue);
		color: white;

		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
		border: 0.25rem solid var(--jcs-blue);
		border-bottom: 0;

		padding: 0.25rem 0.75rem;
	}

	.toast-content p {
		font-size: 1.25rem;
		box-sizing: border-box;

		border-bottom-left-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
		border: 0.25rem solid var(--border-color);
		border-top: none;

		padding: 0.375rem 0.75rem;
	}
</style>



<div id="toasts-container" style:--navbar-height={$formattedNavbarHeight}>
	{#each $toaster as toast (toast.id)}
		<!-- oh my god using these transitions was so much easier why didn't i do this from the start -->
		<div class="toast-wrapper"
		     role="alert"
		     aria-live="assertive"

		     in:fly={{x: "100%", duration: 250, opacity: 1}}
		     out:fly={{x: "100%", duration: 250, opacity: 0}}
		     animate:flip={{duration: 250}}
		>
			<!-- TODO: should this be in the tab order? -->
			<div class="toast-content"
			     role="button"
			     tabindex="-1"
			     aria-label="Toast—click or press space/enter to dismiss"

			     on:click={() => toaster.dismiss(toast.id)}
			     on:keydown={(event) => {if(["Space", "Enter"].includes(event?.code)) toaster.dismiss(toast.id)}}
			>
				<!-- TODO: possibly put an icon & progress bar here -->
				<h3>Lumberjack</h3>
				<p>{toast.content}</p>
			</div>
		</div>
	{/each}
</div>
