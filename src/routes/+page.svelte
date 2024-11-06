<script lang="ts">
	let {data} = $props();
</script>



<h1>this is the generic landing page</h1>

<p>you're really not supposed to be here... if you got here let me know how you did!</p>



{#if !data.session}
	<a href="/auth">click here to sign in!</a>
{:else}
	<a href="/home">click here to go to the home page!</a>
{/if}
