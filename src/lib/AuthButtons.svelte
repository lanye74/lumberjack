<style>
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

	#auth-buttons {
		margin-bottom: 2em;

		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5em;
	}
</style>

<div id="auth-buttons">
	<button id="google-sso">Sign in with Google</button>
	<button id="sign-out" disabled>Sign out</button>
</div>
