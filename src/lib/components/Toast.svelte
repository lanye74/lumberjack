<script lang="ts">
    import {onMount} from "svelte";

	export let duration: number;


	let renderComponent = true;
	let isVisible = false;
	let isUnloading = false;


	const flyInTime = 500;
	const flyOutTime = 750;


	onMount(() => {
		let initialLoadTimer = setTimeout(() => {
			isVisible = true;
		});



		let flyOutTimer: NodeJS.Timeout;

		const visibleTimer = setTimeout(() => {
			isVisible = false;
			isUnloading = true;


			flyOutTimer = setTimeout(() => {
				renderComponent = false;
			}, flyOutTime + 100);
		}, duration + flyInTime);




		return () => {
			clearInterval(initialLoadTimer);
			clearInterval(visibleTimer);
			clearInterval(flyOutTimer);
		}
	});
</script>

<style>
	.wrapper {
		position: absolute;
		bottom: 12vh;
		right: 0;

		padding-left: 1rem;

		overflow: hidden;
	}

	.toast {
		display: flex;
		flex-direction: column;

		background-color: white;
		border-radius: 0.5rem;

		font-style: italic;

		transform: translateX(calc(100% + 1rem));

		max-width: 70vw;
	}



	.wrapper.is-flying-in .toast {
		transform: translateX(-1rem);
		transition: transform 0.5s cubic-bezier(0.3, 0.9, 0.8, 1);
	}

	.wrapper.is-flying-out .toast {
		transition: transform 0.75s cubic-bezier(0.3, 0.7, 0.5, 0.9);
	}



	h3, p {
		margin: 0;
	}


	h3 {
		font: bold 1.75rem var(--font-serif);
		background-color: var(--jcs-blue);
		color: white;

		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
		border: 0.25rem solid var(--jcs-blue);
		border-bottom: 0;

		padding: 0.25rem 0.75rem;
	}

	p {
		font-size: 1.25rem;
		box-sizing: border-box;

		border-bottom-left-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
		border: 0.25rem solid #ccc;
		border-top: none;

		padding: 0.375rem 0.75rem;

	}
</style>


{#if renderComponent}
	<!-- TODO: can i use svelte transition directives instead of this? -->
	<div class="wrapper" class:is-flying-in={isVisible} class:is-flying-out={isUnloading}>
		<div class="toast">
			<!-- TODO: possibly put an icon & progress bar here -->
			<h3>Lumberjack</h3>
			<p><slot /></p>
		</div>
	</div>
{/if}
