<script lang="ts">
	import BorderBox from "$components/BorderBox.svelte";



	const attributes: any[] = [
		"Version 2.6.0",
		"Last updated September 26th, 2024\n→ commit 6ae08fe",
		"Changelog:\n"
	];
</script>

<style>
	h2, h3, p {
		margin: 0;
	}

	h2 {
		font: bold 2.5rem var(--font-serif);
	}

	p {
		font: italic 1.5rem var(--font-serif);
		white-space: pre-wrap;
	}

	h3 {
		font: bold 2rem var(--font-serif);
	}

	ul > li {
		font: 1.5rem var(--font-serif);
	}

	img {
		width: 8rem;
		border-radius: 50%;
	}



	.attributes > * {
		padding: 1.25rem 2rem;
		box-sizing: border-box;

		border-bottom: 0.25rem solid var(--border-color);
	}

	.attributes > *:first-child {
		border-top: 0.25rem solid var(--border-color);
	}

	.attributes > *:last-child {
		border-bottom: none;
	}
</style>



<BorderBox direction="column" alignItems="center" gap="1.5rem">
	<img src="/icons/lumberjack-512-circle-padded.png" alt="Lumberjack logo">

	<h2>JCS Lumberjack</h2>
	<p>by Layne Ogden</p>
</BorderBox>

<!-- TODO: this sucks -->
<div class="attributes">
	<p>Version 2.6.0</p>
	<p>Last updated September 26th, 2024<br />→ commit 6ae08fe</p>

	<div>
		<h3>Changelog</h3>

		<ul>
			<li>The leaderboard should now load significantly faster as a result of streaming</li>
		</ul>
	</div>
</div>
