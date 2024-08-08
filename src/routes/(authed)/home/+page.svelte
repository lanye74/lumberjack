<script lang="ts">
	import generateGreeting from "$lib/generateGreeting.js";



	export let data;

	// no nice way to use destructuring to get around this
	const user = data.user!;
	// const session = data.session!;
	const name = user.user_metadata.full_name as string;
	const firstName = name.split(" ")[0];


	const greeting = generateGreeting();
</script>

<style>
	#greeting-box {
		margin: 2rem;
		padding: 2rem;
		box-sizing: border-box;

		/* TODO: should i just leave these as 4px or what
		         probably not... it's interpolating between 3px - 5px... it's fine */
		border: 0.25rem solid #ccc;
		border-radius: 0.25rem;


		display: flex;
		flex-direction: column;

		gap: 2rem;

		overflow-wrap: break-word;
	}

	h2, p {
		font-family: Lora;
		margin: 0;
	}

	h2 {
		font-size: 3.25rem;
	}

	p {
		font-size: 2rem;
	}
</style>



<div id="greeting-box">
	<h2>{greeting}, {firstName}!</h2>

	<p>What have you been up to?</p>
</div>
