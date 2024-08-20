<script lang="ts">
    import type {User} from "@supabase/supabase-js";

	export let user: UserPublicInfo, index: number;



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

		border-bottom: 0.25rem solid #ccc;

		grid-column: 1 / span 3;
	}

	/* interestingly, this persists across components, so this still takes effect inside an each block */
	.user:last-child {
		border-bottom: none;
	}



	.place {
		grid-column: 1;

		font: normal bold 2.5rem var(--font-family);
	}

	img {
		grid-column: 2;

		/* prevent pop-in */
		display: inline-block;
		height: 5rem;
		width: 5rem;

		border-radius: 50%;
	}

	.text {
		grid-column: 3;


		display: flex;
		flex-direction: column;
	}



	.text p {
		margin: 0;
	}

	.text .name {
		font: normal bold 1.5rem var(--font-family);
	}

	.text .points {
		font: italic normal 1.25rem var(--font-family);
		color: #666;
	}
</style>



<div class="user">
	<span class="place">{index + 1}.</span>

	<!-- TODO: store a local user missing asset -->
	<!-- TODO: (2) figure out how to use skeleton loaders for this stuff
			   currently waiting for the server halts page loading = bad UX -->
	<!-- svelte-ignore a11y-img-redundant-alt -->
	<img src={user.avatarUrl ?? "https://www.ais.unwater.org/ais/aiscm/pdf/lib/tcpdf/images/logo_example.png"} alt="User profile picture">

	<div class="text">
		<p class="name">{user.fullName}</p>
		<p class="points">{formatNumber(user.points)} points</p>
	</div>
</div>
