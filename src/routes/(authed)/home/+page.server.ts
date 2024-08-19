import {submitLocationPrefix} from "$lib/consoleColorPrefixes.js";
import {parseSubmitLocationForm} from "$lib/parseSubmitLocationForm.js";



export const actions = {
	submitLocation: async (requestEvent) => {
		const formData = await requestEvent.request.formData();
		const parsedForm = parseSubmitLocationForm(formData);

		if(parsedForm.isValid === false) {
			return {
				error: true
			};
		}


		const {supabase} = requestEvent.locals;
		// :c
		const user = requestEvent.locals.user!;


		const {userLocation, userPurpose, wasTyped} = parsedForm;
		const currentTime = new Date().toISOString();


		const {error} = await supabase.from("location_logs")
			.insert({
				timestamp: currentTime,
				google_user_id: user.id,

				location: userLocation,
				purpose: userPurpose,
				was_typed: wasTyped
			});


		if(error) {
			console.error(...submitLocationPrefix, "Error submitting location", error);
		}

		return {
			error: error !== null
		};
	}
}
