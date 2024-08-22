<script lang="ts">
	import {enhance} from "$app/forms";
</script>



<section>
	<h1>Welcome to Lumberjack</h1>

	<p>click on the button below to sign in</p>


	<form action="?/signIn" method="POST" use:enhance>
		<button type="submit">sign in</button>
	</form>
</section>
