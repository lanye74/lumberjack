<script lang="ts">
	import {onMount} from "svelte";
	import {navbarHeight} from "$lib/stores.js";



	export let duration: number;


	let renderComponent = true;
	let isVisible = false;
	let isUnloading = false;


	const flyInTime = 500;
	const flyOutTime = 750;



	let initialLoadTimer: NodeJS.Timeout, visibleTimer: NodeJS.Timeout, flyOutTimer: NodeJS.Timeout;


	onMount(() => {
		flyIn();

		return clearTimers;
	});



	function flyIn() {
		initialLoadTimer = setTimeout(() => {
			isVisible = true;
		});


		visibleTimer = setTimeout(() => {
			dismiss();
		}, duration + flyInTime);
	}



	function dismiss() {
		isVisible = false;
		isUnloading = true;


		flyOutTimer = setTimeout(() => {
			renderComponent = false;
		}, flyOutTime + 100);
	}



	function clearTimers() {
		clearInterval(initialLoadTimer);
		clearInterval(visibleTimer);
		clearInterval(flyOutTimer);
	}
</script>

<style>
	.wrapper {
		position: fixed;
		bottom: calc(var(--navbar-height) + 4vh);
		right: 0;

		padding-left: 1rem;

		overflow: hidden;
		cursor: pointer;
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
	<!-- TODO: (2) wrap this in a button instead of a div -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="wrapper" class:is-flying-in={isVisible} class:is-flying-out={isUnloading} style:--navbar-height={`${$navbarHeight}px`} on:click={dismiss} role="dialog">
		<div class="toast">
			<!-- TODO: possibly put an icon & progress bar here -->
			<h3>Lumberjack</h3>
			<p><slot /></p>
		</div>
	</div>
{/if}
