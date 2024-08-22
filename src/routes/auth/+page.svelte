<script lang="ts">
	import {enhance} from "$app/forms";
</script>

<style>
	main {
		width: 100vw;
		height: 100vh;
		padding: 4rem 2rem;
		box-sizing: border-box;

		background-color: var(--jcs-blue);


	}

	section {
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	h1 {
		color: var(--jcs-cyan);
		font: 750 4rem var(--font-sans-serif);

		margin: 0;
	}

	p {
		color: white;

		font: 2.5rem var(--font-sans-serif);

		margin: 0;
		margin-top: 2rem;
	}



	/* TODO: make a Button component with sensible defaults */
	button {
		width: 100%;
		/* TODO: use em in cases like this */
		padding: 1rem 4rem;
		box-sizing: border-box;

		background-color: var(--jcs-cyan);
		font: bold 2rem var(--font-sans-serif);
		color: white;

		border-radius: 10rem;
		border: none;
	}

	button:hover {
		cursor: pointer;
	}
</style>



<main>
	<section>
		<div class="text">
			<h1>Welcome to JCS Lumberjack!</h1>

			<p>Log where you are, instantly</p>
		</div>



		<form action="?/signIn" method="POST" use:enhance>
			<button type="submit">Sign in with Google</button>
		</form>
	</section>
</main>
