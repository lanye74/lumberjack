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
	:global(body) {
		overflow: hidden;
	}



	/* the point of this wrapper is essentially that
		a user hovers over the info icon, but when the tool expands they're not hovering it anymore (because of the margin)
		thus the tool closes, intersecting the cursor, causing it to expand, causing it to not be hovered; ping-ponging
		instead, this can be circumvented (and i think it's generally nicer ux) by having a wrapper
		that goes around the tool's expanded position, so that hovering anywhere in it will cause it to expand

		the padding on the bottom was originally so the box shadow didn't get cropped
		but might as well add it to the top and call it a feature
	*/
	.wrapper {
		position: absolute;
		bottom: 12vh;
		right: 0;

		/* don't break mobile */

		padding-left: 4rem;

		overflow: hidden;
	}


	.toast {
		display: flex;
		flex-direction: column;

		/* border: 0.15rem solid var(--theme-black-darker); */
		background-color: white;
		border-radius: 0.5rem;
		/* box-shadow: var(--standard-box-shadow); */

		font-style: italic;

		transform: translateX(calc(100% + 1rem));

		max-width: 70vw;
	}



	.wrapper.is-flying-in .toast {
		transform: translateX(-1rem);
		transition: transform 0.5s cubic-bezier(0.3, 0.9, 0.8, 1);
	}

	.wrapper.is-flying-out .toast {
		transition: transform 0.75s cubic-bezier(0.8, -0.5, 0.7, 1);
	}



	h3, p {
		margin: 0;
		padding: 0.25rem 1rem;
	}


	h3 {
		font: bold 1.75rem var(--font-serif);
		background-color: var(--jcs-blue);
		color: white;

		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
	}

	p {
		font-size: 1.25rem;
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
