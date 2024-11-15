<script lang="ts">
	import SubmitLocationForm from "$components/SubmitLocationForm.svelte";

	import {jcsSites, possibleVisitPurposes} from "$utils/forms/options.js";
	import toaster from "$utils/stores/toaster.js";



	let {data, form} = $props();
	// no nice way to use destructuring to get around this

	const {currentProfile} = data;
	const formSites = jcsSites[currentProfile];
	const formPurposes = possibleVisitPurposes[currentProfile];


	$effect(() => {
		if(form && form.message) {
			toaster.toast({duration: 4000, content: form.message});
		}
	});
</script>

<section>
	<SubmitLocationForm {currentProfile}
		purposeChoices={formPurposes}
		siteChoices={formSites} />
</section>
