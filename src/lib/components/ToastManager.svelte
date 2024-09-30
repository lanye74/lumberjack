<script lang="ts">
	// TODO: is this okay
	import {navbarHeight, toaster} from "../stores.js";



	let isFlyingIn = false;
	let isFlyingOut = false;
	let isVisible = false;

	let timers: NodeJS.Timeout[] = [];


	const flyInTime = 500;
	const flyOutTime = 750;

	$: if($toaster && !$toaster.initial) {
		// reset
		isFlyingIn = false;
		isFlyingOut = false;

		timers.forEach(clearInterval);
		timers = [];

		flyIn();
	}


	function flyIn() {
		// won't re-render unless i wrap this in a tiny timeout
		timers.push(setTimeout(() => {
			isFlyingIn = true;
			isVisible = true;
		}, 1));

		timers.push(setTimeout(() => dismiss(), $toaster.duration + flyInTime));
	}



	function dismiss() {
		isFlyingIn = false;
		isFlyingOut = true;

		timers.push(setTimeout(() => {
			isFlyingOut = false,
			isVisible = false;
		}, flyOutTime + 1));
	}
</script>

<style>
	.toast {
		position: fixed;
		bottom: calc(var(--navbar-height) + 4vh);
		right: 0;

		padding-left: 1rem;

		overflow: hidden;
		cursor: pointer;

		display: flex;
		flex-direction: column;

		background-color: white;
		border-radius: 0.5rem;

		transform: translateX(calc(100% + 1rem));

		max-width: 70vw;
	}



	#toast-manager.is-flying-in .toast {
		transform: translateX(-1rem);
		transition: transform 0.5s cubic-bezier(0.3, 0.9, 0.8, 1);
	}

	#toast-manager.is-flying-out .toast {
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
		border: 0.25rem solid var(--border-color);
		border-top: none;

		padding: 0.375rem 0.75rem;
	}
</style>



<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="toast-manager"
	style:--navbar-height={`${$navbarHeight}px`}
	aria-live="assertive"
	aria-hidden={!isVisible}
	role="alert"
	class:is-flying-in={isFlyingIn}
	class:is-flying-out={isFlyingOut}
	on:click={dismiss}
>
	<div class="toast">
		<!-- TODO: possibly put an icon & progress bar here -->
		<h3>Lumberjack</h3>

		<p>{$toaster.content}</p>
	</div>
</div>
