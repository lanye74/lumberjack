<script lang="ts">
	import Toast from "./Toast.svelte";
	import {toaster} from "../stores.js";
</script>



<div id="toast-manager">
	{#each $toaster as toast}
		<Toast content={toast.content} dismiss={() => toaster.dismiss(toast.toastNumber)} />
	{/each}
</div>
