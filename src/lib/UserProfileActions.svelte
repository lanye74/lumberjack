<script lang="ts">
	import {invalidateAll} from "$app/navigation";
	// @ts-ignore
	import FaSignOutAlt from "svelte-icons/fa/FaSignOutAlt.svelte";



	const userProfileActions = [
		{
			text: "Logout",
			componentIcon: FaSignOutAlt,
			callback: async () => {
				await fetch("/auth/logout", {method: "POST"});
				invalidateAll();
			}
		}
	];
</script>

<style>
	button {
		border: none;
		background: none;
		outline: none;
		padding: 1.25rem 2rem;

		font-size: 1.75rem;
		cursor: pointer;

		width: 100%;
		text-align: left;

		border-bottom: 0.25rem solid #ccc;

		display: flex;
		flex-direction: row;
		gap: 2rem;

		align-items: center;
	}

	button .icon {
		height: 3rem;
	}
</style>



{#each userProfileActions as action}
	<button on:click={action.callback}>
		<div class="icon">
			<svelte:component this={action.componentIcon} />
		</div>

		{action.text}
	</button>
{/each}
