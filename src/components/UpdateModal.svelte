<script lang="ts">
    import {onMount} from "svelte";
	import RedoAlt from "virtual:icons/fa-solid/redo-alt";



	let modal: HTMLDialogElement;


	onMount(() => {
		modal.showModal();

		function showModal() {
			modal.showModal();
		}


		// prevent closing; they must accept the reload
		modal.addEventListener("close", showModal);

		return () => modal.removeEventListener("close", showModal);
	});
</script>

<style>
	dialog {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);

		width: calc(100% - 4rem);
		height: calc(100% - 4rem);
		box-sizing: border-box;
		border-radius: 0.25rem;

		border: none;
		padding: 0;
		margin: 0;

		background-color: white;

		z-index: 100000;

		display: flex;
		flex-direction: column;

		animation: flyIn 1s forwards;
	}



	@keyframes flyIn {
		0% {
			opacity: 1;
			transform: translate(-50%, calc(-50% + 10vh));
		}

		100% {
			opacity: 1;
			transform: translate(-50%, -50%);
		}
	}


	dialog::backdrop {
		background-color: #000;
		opacity: 0.5;
	}

	.content-wrapper {
		border: 0.25rem solid var(--border-color);
		border-radius: inherit;
		border-bottom: 0;

		padding: 2rem;

		display: flex;
		flex-direction: column;
		gap: 2rem;

		flex-grow: 1;
	}



	.content-wrapper h2 {
		font: bold 2.5rem var(--font-serif);
		margin: 0;
	}

	.content-wrapper p {
		font: 1.8rem var(--font-serif);
		margin: 0;
	}



	/* TODO: actually make a proper button component */
	button {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 2rem;

		width: 100%;
		font: 600 2rem var(--font-serif);

		background-color: var(--jcs-blue);
		border: none;
		color: white;

		padding: 1rem 2rem;

		cursor: pointer;
	}

	button > p {
		align-self: center;
		margin: 0;
	}
</style>



<dialog bind:this={modal}>
	<div class="content-wrapper">
		<h2>There’s a new Lumberjack update!</h2>

		<p>Press the button below to load the latest version.</p>
	</div>

	<button on:click={() => window.location.reload()}>
		<RedoAlt style="align-self: center" />
		<p>Reload</p>
	</button>
</dialog>
