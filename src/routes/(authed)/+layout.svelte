<script lang="ts">
	import NavBar from "$lib/components/NavBar.svelte";
	import TopBar from "$lib/components/TopBar.svelte";
	import {onNavigate} from "$app/navigation";
    import {page} from "$app/stores";



	onNavigate(navigation => {
		// TODO: remove these ts-ignores when it becomes official spec
		// npm @types/dom-view-transitions?
		// @ts-ignore
		if(!document.startViewTransition) return;

		if(navigation.to?.route.id === $page.route.id) return;

		return new Promise(resolve => {
			// @ts-ignore
			document.startViewTransition(async () => {
				resolve();

				await navigation.complete;
			});
		});
	});
</script>

<style>
	.bottom-padding {
		height: calc(8.25rem);
	}



	@keyframes slide-to-left {
		to {
			transform: translateX(-100%);
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(100%);
		}
	}

	:root::view-transition-old(root) {
		animation: 0.5s cubic-bezier(0.2, 0.8, 0.7, 1) both slide-to-left;
	}

	:root::view-transition-new(root) {
		animation: 0.5s cubic-bezier(0.2, 0.8, 0.7, 1) both slide-from-right;
	}

	@media (prefers-reduced-motion) {
		::view-transition-group(*),
		::view-transition-old(*),
		::view-transition-new(*) {
			animation: none !important;
		}
	}
</style>



<TopBar />

<main>
	<slot />
</main>



<div class="bottom-padding"></div>

<NavBar />
