<script lang="ts">
	import Header from "$lib/components/Header.svelte";
	import Navbar from "$lib/components/Navbar.svelte";
	import {navbarHeight} from "$lib/stores.js";



	// TODO: (VERY VERY IMPORTANT)
	// THIS WHOLE NAVIGATION THING MEANS PEOPLE WILL WANT SWIPE CONTROLS
	// POSSIBLY SHELF THIS TRANSITION AND ADD IT BACK AS A FEATURE
	/* onNavigate(navigation => {
		if(!document.startViewTransition ||
		   navigation.to?.route.id === $page.route.id) return;

		return enableCorrectTransitionForNavigation(navigation, $page.route.id);
	}); */
</script>

<style>
	.bottom-padding {
		/* 0.25rem needs to be added here to match the top border
		   for one reason or another bind:clientHeight does not include it */
		height: calc(var(--height) + 0.25rem);
	}



	/* @keyframes slide-from-left {
		from {
			transform: translateX(-100vw);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-100vw);
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(100vw);
		}
	}

	@keyframes slide-to-right {
		to {
			transform: translateX(100vw);
		}
	}


	:root.sliding-in-from-left::view-transition-old(root) {
		animation: 0.5s cubic-bezier(0.2, 0.8, 0.7, 1) both slide-to-right;
	}

	:root.sliding-in-from-left::view-transition-new(root) {
		animation: 0.5s cubic-bezier(0.2, 0.8, 0.7, 1) both slide-from-left;
	}

	:root.sliding-in-from-right::view-transition-old(root) {
		animation: 0.5s cubic-bezier(0.2, 0.8, 0.7, 1) both slide-to-left;
	}

	:root.sliding-in-from-right::view-transition-new(root) {
		animation: 0.5s cubic-bezier(0.2, 0.8, 0.7, 1) both slide-from-right;
	}


	@media (prefers-reduced-motion) {
		::view-transition-group(*),
		::view-transition-old(*),
		::view-transition-new(*) {
			animation: none !important;
		}
	} */
</style>



<Header />

<main>
	<slot />
</main>



<div class="bottom-padding" style:--height={`${$navbarHeight}px`}></div>

<Navbar bind:height={$navbarHeight} />
