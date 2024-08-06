<script lang="ts">
	export let data;
</script>



<h1>this is the generic landing page</h1>



{#if !data.session}
	<a href="/auth">click here to sign in!</a>
{:else}
	<a href="/home">click here to go to the home page!</a>
{/if}
