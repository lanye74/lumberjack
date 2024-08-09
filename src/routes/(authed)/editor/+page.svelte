<script lang="ts">
	export let data;



	const {recentLogs} = data;
</script>



{#if recentLogs === null}
	<!-- TODO: pretty this up -->
	<p>there was an issue while trying to fetch your logs!</p>
{:else if recentLogs.length === 0}
	<p>you don't have any logs! switch to the home tab to start logging</p>
{:else}
	<p>there's logs here!</p>
{/if}
