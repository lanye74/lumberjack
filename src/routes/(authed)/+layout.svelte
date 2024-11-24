<script lang="ts">
	import {onNavigate} from "$app/navigation";
	import {page, updated} from "$app/stores";

	import Header from "$components/Header.svelte";
	import Navbar from "$components/Navbar.svelte";
	import UpdateModal from "$components/UpdateModal.svelte";

	import {enableCorrectTransitionForNavigation} from "$utils/routing/routes.js";
	import {formattedNavbarHeight, navbarHeight} from "$utils/stores/navbarHeight.js";



	const {children} = $props();

	// let showNav = $derived($page.route.id !== "/(authed)/home");


	// TODO: swipe controls?
	// TODO: why isn't a bunch of this stuff in  the /routes layout?
	onNavigate(navigation => {
		if(!document.startViewTransition ||
		   navigation.to?.route.id === $page.route.id) return;

		return enableCorrectTransitionForNavigation(navigation, $page.route.id);
	});
</script>

<style>
	.bottom-padding {
		/* 0.25rem needs to be added here to match the top border
		   for one reason or another bind:clientHeight does not include it */
		height: calc(var(--height) + 0.25rem);
	}



	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes slide-from-left {
		from {
			transform: translateX(-40vw);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-40vw);
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(40vw);
		}
	}

	@keyframes slide-to-right {
		to {
			transform: translateX(40vw);
		}
	}


	:root.sliding-in-from-left::view-transition-old(root) {
		animation: 0.1s cubic-bezier(0.4, 0, 1, 1) both fade-out,
		           0.3s cubic-bezier(0.2, 0.7, 0.7, 1) both slide-to-right;
	}

	:root.sliding-in-from-left::view-transition-new(root) {
		animation: 0.1s cubic-bezier(0.4, 0, 1, 1) both fade-in,
		           0.3s cubic-bezier(0.2, 0.7, 0.7, 1) both slide-from-left;
	}

	:root.sliding-in-from-right::view-transition-old(root) {
		animation: 0.1s cubic-bezier(0.4, 0, 1, 1) both fade-out,
		           0.3s cubic-bezier(0.2, 0.7, 0.7, 1) both slide-to-left;
	}

	:root.sliding-in-from-right::view-transition-new(root) {
		animation: 0.1s cubic-bezier(0.4, 0, 1, 1) both fade-in,
		           0.3s cubic-bezier(0.2, 0.7, 0.7, 1) both slide-from-right;
	}


	@media (prefers-reduced-motion) {
		::view-transition-group(*),
		::view-transition-old(*),
		::view-transition-new(*) {
			animation: none !important;
		}
	}
</style>



<Header />



{#if $updated}
	<UpdateModal />
{/if}



<main>
	{@render children()}
</main>



<div class="bottom-padding" style:--height={$formattedNavbarHeight}></div>


<!-- {#if showNav} -->
<Navbar bind:height={$navbarHeight} />
<!-- {/if} -->
