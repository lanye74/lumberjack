<script lang="ts">
    import {enhance} from "$app/forms";
	import {manager} from "$lib/main.js";
</script>

<style>
	#log-location {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5em;

		font: 1em system-ui, arial;
		color: var(--text-white);
	}



	button {
		background: none;
		font: normal bold 1em system-ui, arial;
		color: var(--text-white);

		border: 1px solid var(--white-darker);
		box-sizing: border-box;
		border-radius: 4px;
	}

	button:hover {
		text-decoration: underline;
		cursor: pointer;

		background-color: var(--text-white);
		color: var(--bg-color);
	}

	button:disabled {
		cursor: default;
		text-decoration: none;
		color: var(--white-darker);
	}



	#location-input {
		background-color: transparent;
		border: none;
		border-bottom: 1px solid var(--text-white);

		font: 1em system-ui, arial;
		color: var(--text-white);
		text-align: left;
	}

	#location-input:focus-visible {
		outline: none;
	}
</style>

<form id="log-location" method="POST" use:enhance action="?/submitLocation">
	Log location:
	<input type="text" id="location-input" name="location">
	<button type="submit" id="submit-location" disabled={manager.authManager.authState === "SIGNED_OUT"}>Submit</button>
</form>
