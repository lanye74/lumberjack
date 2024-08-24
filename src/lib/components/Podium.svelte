<script lang="ts">
    import ImageWithIconFallback from "./ImageWithIconFallback.svelte";

	// TODO: move these types to a unified location
	type UserPublicInfo = {
		googleUserId: string;
		fullName: string;
		avatarUrl: string;
		points: number;
	};

	export let users: UserPublicInfo[];

	const podiumPlaces = ["first", "second", "third"];


	const pointsFormatter = new Intl.NumberFormat().format;
	const pixelFormatter = new Intl.NumberFormat("en-US", {maximumFractionDigits: 1, useGrouping: false}).format;


	let columnWidth: number;
	$: iconSize = `${pixelFormatter(columnWidth * 0.8)}px`;
</script>

<style>
	.podium {
		margin: 2rem;
		padding: 2rem;

		border-radius: 0.25rem;
		border: 0.25rem solid #aaa;
		box-shadow: 0 0.5rem 1rem #0003;

		box-sizing: border-box;

		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: auto;
		grid-template-areas: "second first third";

		align-items: end;
		justify-content: center;

		gap: 1rem;
	}

	.podium-place {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.image-wrapper {
		display: flex;
		justify-content: center;

		border-radius: 50%;
		color: #aaa;

		width: 80%;
		font-size: var(--icon-size);

		margin-bottom: 1rem;
	}



	.user-info p {
		margin: 0 0 0.25rem 0;
		text-align: center;
	}

	.user-info .name {
		font: bold 1.5rem var(--font-serif);
	}

	.user-info .points {
		font: italic 1.25rem var(--font-serif);
	}



	.place-first.podium-place {
		grid-area: first;
	}

	.place-second.podium-place {
		grid-area: second;
	}

	.place-third.podium-place {
		grid-area: third;
	}



	.podium-bar {
		width: 100%;
	}

	.place-first .podium-bar {
		height: 7rem;
		/* oklch(85% 0.2 80) */
		background-color: #ffbd00;
	}

	.place-second .podium-bar {
		height: 5rem;
		/* oklch(70% 0.01 240) */
		background-color: #999fa4;
	}

	.place-third .podium-bar {
		height: 3rem;
		/* oklch(45% 0.12 45) */
		background-color: #893a03;
	}
</style>



<section class="podium">
	{#each users as user, index}
		<div class={`podium-place place-${podiumPlaces[index]}`} bind:clientWidth={columnWidth}>
			<!-- TODO: investigate using this without a wrapper -->
			<div class="image-wrapper" style:--icon-size={iconSize}>
				<ImageWithIconFallback class="image-fallback"
					src={user.avatarUrl} alt="User profile picture"
					iconId="fa-solid:user-circle" />
			</div>

			<div class="user-info">
				<p class="name">{user.fullName}</p>
				<p class="point
				s">{pointsFormatter(user.points)} pts.</p>
			</div>

			<div class="podium-bar"></div>
		</div>
	{/each}
</section>
