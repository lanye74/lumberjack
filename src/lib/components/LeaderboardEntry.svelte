<script lang="ts">
	import AvatarFromAtlas from "$components/AvatarFromAtlas.svelte";

	import type {PointsLeaderboardEntry} from "$types/database.js";



	type Props = {
		user: PointsLeaderboardEntry;
		index: number;

		atlasSrc: string | null;
		hasAvatarError?: boolean
	};

	const {
		user,
		index,
		atlasSrc,
		hasAvatarError = false
	}: Props = $props();


	const formatNumber = new Intl.NumberFormat().format;
</script>

<style>
	.user {
		display: grid;

		grid-template-columns: subgrid;
		grid-template-rows: subgrid;

		align-items: center;


		/* TODO: standardize some properties e.g. this specific padding */
		padding: 1.25rem 2rem;
		box-sizing: border-box;

		border-bottom: 0.25rem solid var(--border-color);

		grid-column: 1 / span 3;
	}

	/* interestingly, this persists across components, so this still takes effect inside an each block */
	.user:first-child {
		border-top: 0.25rem solid var(--border-color);
	}

	.user:last-child {
		border-bottom: none;
	}



	.place {
		font: bold 2.5rem var(--font-serif);
		text-align: right;
	}

	.text {
		display: flex;
		flex-direction: column;
	}



	.text p {
		margin: 0;
	}

	.text .name {
		font: bold 1.5rem var(--font-serif);
	}

	.text .points {
		font: italic 1.25rem var(--font-serif);
		color: var(--subtext-color);
	}
</style>



<div class="user">
	<span class="place">{index + 1}.</span>

	<!-- TODO: figure out how to use skeleton loaders for this stuff
	           currently waiting for the server halts page loading = bad UX -->
	<AvatarFromAtlas src={atlasSrc} absoluteSize="5rem"
		positionIndex={{x: index, y: 0}}
		atlasTiles={{x: 10, y: 1}}
		hasError={hasAvatarError} />

	<div class="text">
		<p class="name">{user.fullName}</p>
		<p class="points">{formatNumber(user.points)} points</p>
	</div>
</div>
