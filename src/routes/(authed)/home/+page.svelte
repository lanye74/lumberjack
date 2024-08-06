<script lang="ts">
	export let data;

	// no nice way to use destructuring to get around this
	const user = data.user!;
	// const session = data.session!;
	const name = user.user_metadata.full_name as string;

	console.log(user);
</script>

<style>
	h1 {
		font-family: Lora;
	}
</style>



<h1>Welcome, {name}!</h1>

<form action="/auth/logout" method="POST">
	<button type="submit">log out</button>
</form>
