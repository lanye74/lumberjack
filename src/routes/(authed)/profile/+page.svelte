<script lang="ts">
	export let data;

	const user = data.user!;


	let avatarUrl = user.user_metadata.avatar_url as string;

	// TODO: handle this in a more robust way
	if(avatarUrl.includes("=s96-c")) {
		avatarUrl = avatarUrl.replace("=s96-c", "=s256-c");
	}
</script>

<style>
	.name-icon {
		padding: 2rem;

		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;

		gap: 2rem;

		border-bottom: 0.25rem solid #ccc;
	}

	.name-icon span {
		font: normal bold 2rem Lora;
	}

	img {
		border-radius: 50%;
		filter: drop-shadow(0.5rem 0.5rem 1rem #0004);

		width: 6rem;
		height: 6rem;
	}



	.options ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.options li {
		font: 1.5rem Lora;

		padding: 1rem 2rem;
		border-bottom: 0.25rem solid #ccc;
	}

	.options li button {
		border: none;
		background: none;
		outline: none;
		margin: 0;
		padding: 0;

		font: 1.5rem Lora;
		cursor: pointer;

		width: 100%;
		text-align: left;
	}
</style>



<section class="profile-preview">
	<!-- TODO: maybe turn this into a card-not-card-block-thing like the "welcome" on the home page? -->
	<div class="name-icon">
		<!-- svelte-ignore a11y-img-redundant-alt -->
		<img src={avatarUrl ?? "https://www.ais.unwater.org/ais/aiscm/pdf/lib/tcpdf/images/logo_example.png"} alt="User profile picture">

		<span>{user.user_metadata.full_name}</span>
	</div>

	<div class="options">
		<ul>
			<!-- TODO: completely redo how this is set up. it's so terrible
			           it probably needs to be turned into an each block, and all of these need to be anchor tags
			           i just cba to do it right now honestly
			           of course they will need icons as well... ughhh whatever bro -->
			<li>here's an option</li>
			<li>here's an option</li>
			<li>here's an option</li>
			<li>here's an option</li>
			<li>
				<form action="/auth/logout" method="POST">
					<button type="submit">log out</button>
				</form>
			</li>
		</ul>
	</div>
</section>
