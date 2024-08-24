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



	const podiumPlaces = ["first", "second", "third"]
</script>

<style>
	.podium {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: auto;
		grid-template-areas: "second first third";

		align-items: end;
		justify-content: center;

		margin: 2rem;
		padding: 0 2rem;

		gap: 1rem;
	}

	.podium-place {
		display: flex;
		flex-direction: column;
	}

	.image-wrapper {
		border-radius: 50%;
		color: #aaa;

		/* height: 10rem;
		width: 10rem;
		font-size: 10rem; */
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
		<div class={`podium-place place-${podiumPlaces[index]}`}>
			<!-- TODO: investigate using this without a wrapper -->
			<div class="image-wrapper">
				<ImageWithIconFallback class="image-fallback"
					src={user.avatarUrl} alt="User profile picture"
					iconId="fa-solid:user-circle" />
			</div>

			<div class="podium-bar"></div>
		</div>
	{/each}
</section>
