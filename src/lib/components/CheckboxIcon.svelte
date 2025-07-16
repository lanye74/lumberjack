<script lang="ts">
	import {iconComponentMap} from "$utils/icons.js";



	type Props = {
		checked: boolean;
		color: string;
		size: string;
	};

	let {
		checked,
		color,
		size
	}: Props = $props();


	const UncheckedIcon = iconComponentMap["checkbox-unchecked"];
	const CheckedIcon = iconComponentMap["checkbox-checked"];
</script>

<style>
	.checkbox-container {
		display: flex;
		align-items: center;
	}
</style>



<div class="checkbox-container"
     style:color={color}
     style:font-size={size}
>
	{#if checked === true}
		<CheckedIcon />
	{:else}
		<UncheckedIcon />
	{/if}
</div>
