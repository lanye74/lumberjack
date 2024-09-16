<script lang="ts">
	import {formatPoints} from "$lib/formatters.js";
	import type {PointsLeaderboardEntry} from "$lib/types/database.js";
	import UserAvatar from "./UserAvatar.svelte";



	export let users: PointsLeaderboardEntry[];

	const numberPlaces = Math.min(users.length, 3);
</script>

<style>
	.podium {
		display: grid;
		grid-template-rows: auto;

		align-items: end;
		justify-content: center;
		justify-items: center;

		gap: 1rem;

		padding: 0 0.5rem;
	}

	.podium:not([data-places="0"]) {
		border-bottom: 0.25rem solid var(--gray-3);
	}

	.podium[data-places="1"] {
		/* i am aware there is some amoutn of repeat(var(--num-places), 1fr) trickery that could be done
		   ...too bad */
		grid-template-columns: 1fr;
		grid-template-areas: "first";
	}

	.podium[data-places="1"] .podium-place {
		max-width: 45vw;
	}

	.podium[data-places="2"] {
		grid-template-columns: 1fr 1fr;
		grid-template-areas: "first second";
	}

	.podium[data-places="2"] .podium-place {
		max-width: 30vw;
	}

	.podium[data-places="3"] {
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-areas: "second first third";
	}



	.podium-place {
		display: flex;
		flex-direction: column;
		align-items: center;

		width: 100%;
	}

	.user-info p {
		margin: 0.25rem 0 0.25rem 0;
		text-align: center;
	}

	.user-info .name {
		font: bold 1.5rem var(--font-serif);
	}

	.user-info .points {
		font: italic 1.25rem var(--font-serif);
	}



	.podium-place[data-place="1"] {
		grid-area: first;
	}

	.podium-place[data-place="2"] {
		grid-area: second;
	}

	.podium-place[data-place="3"] {
		grid-area: third;
	}



	.podium-bar {
		width: 100%;
		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;

		/* box-shadow: 0.25rem 0.5rem 0.5rem #0003; */
	}

	.podium-place[data-place="1"] .podium-bar {
		height: 8rem;
		/* oklch(85% 0.2 80) */
		background-color: #ffbd00;
	}

	.podium-place[data-place="2"] .podium-bar {
		height: 5rem;
		/* oklch(75% 0.01 240) */
		background-color: #a8afb4;
	}

	.podium-place[data-place="3"] .podium-bar {
		height: 3rem;
		/* oklch(60% 0.12 55) */
		background-color: #b66b31;
	}



	.fallback-text-container {
		display: flex;
		flex-direction: column;

		gap: 1rem;
	}

	.fallback-text-container h3, p {
		text-align: center;
		margin: 0;
	}

	.fallback-text-container h3 {
		font: bold 3rem var(--font-serif);
	}

	.fallback-text-container p {
		font: normal 1.75rem var(--font-serif);
	}
</style>



<div class="podium" data-places={numberPlaces}>
	{#if users.length === 0}
		<div class="fallback-text-container">
			<h3>You're one of the first!</h3>
			<p>Submit a log to begin the leaderboard.</p>
		</div>
	{:else}
		{#each users as user, index}
			<div class="podium-place" data-place={index + 1}>
				<UserAvatar	src={user.avatarUrl} percentageSize={80} />

				<div class="user-info">
					<p class="name">{user.fullName}</p>
					<p class="points">{formatPoints(user.points)} pts.</p>
				</div>

				<div class="podium-bar"></div>
			</div>
		{/each}
	{/if}
</div>
