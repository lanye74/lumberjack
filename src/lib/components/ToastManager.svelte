<script lang="ts">
	import Toast from "./Toast.svelte";
	import {toaster} from "../stores.js";



	$: console.log($toaster);
</script>



<div id="toast-manager">
	{#each $toaster as toast}
		<Toast duration={toast.duration} content={toast.content} />
	{/each}
</div>
