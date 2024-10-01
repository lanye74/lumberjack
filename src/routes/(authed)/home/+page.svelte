<script lang="ts">
	import BorderBox from "$lib/components/BorderBox.svelte";
	import SubmitLocationForm from "$lib/components/SubmitLocationForm.svelte";
	import {currentDate, currentFormattedTime, toaster} from "$lib/stores.js";
	import generateGreeting from "$lib/generateGreeting.js";
	import {jcsSites, possibleVisitPurposes} from "$lib/parseSubmitLocationForm.js";



	export let data, form;
	// no nice way to use destructuring to get around this
	const user = data.user!;

	const {currentProfile} = data;
	const formSites = jcsSites[currentProfile];
	const formPurposes = possibleVisitPurposes[currentProfile];


	// this really doesn't need to be reactive but it'll make me feel fancy
	// there's no way that this is an expensive enough operation i really have to trash it
	$: greeting = generateGreeting(user, $currentDate);

	$: if(form && form.message) {
		toaster.toast({duration: 4000, content: form.message!});
	}
</script>

<style>
	h2, p {
		margin: 0;
	}

	h2 {
		font: bold 2.8rem var(--font-serif);
	}

	p {
		font-size: 2rem;
	}

	span.time {
		font: 600 2rem var(--time-font);
	}
</style>



<BorderBox direction="column" gap="1rem">
	<h2>{greeting}</h2>

	<p>What have you been up to? It's currently <span class="time">{$currentFormattedTime.string}.</span></p>
</BorderBox>

<section>
	<SubmitLocationForm {currentProfile}
		purposeChoices={formPurposes}
		siteChoices={formSites} />
</section>
