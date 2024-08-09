<script lang="ts">
	import generateGreeting from "$lib/generateGreeting.js";
    import {derived, readable} from "svelte/store";



	export let data;

	// no nice way to use destructuring to get around this
	const user = data.user!;
	// const session = data.session!;
	const name = user.user_metadata.full_name as string;
	const firstName = name.split(" ")[0];


	const greeting = generateGreeting();



	const timeReadable = readable(new Date(), (set) => {
		const interval = setInterval(() => {
			set(new Date());
		}, 1000);


		return () => clearInterval(interval);
	});

	const time = derived(timeReadable, ($date => {
		return Intl.DateTimeFormat("en", {
			hour: "numeric",
			hour12: true,

			minute: "2-digit",
			second: "2-digit"
		}).format($date);
	}));
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

	span.time {
		font: normal 600 2rem CascadiaCode;
	}
</style>



<div id="greeting-box">
	<h2 class="greeting">{greeting}, {firstName}!</h2>

	<!-- i need a better name for this class but whatever it's not that important -->
	<p>What have you been up to? It's currently <span class="time">{$time}.</span></p>
</div>
