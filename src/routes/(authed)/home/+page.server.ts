import {parseSubmitLocationForm} from "$lib/parseSubmitLocationForm.js";
import {submitLocationLogPrefix} from "$lib/consoleColorPrefixes.js";



export const actions = {
	submitLocation: async (requestEvent) => {
		const formData = await requestEvent.request.formData();
		const parsedForm = parseSubmitLocationForm(formData);

		if(parsedForm.isValid === false) {
			return {
				error: true,
				message: "Don't submit invalid data >:("
			};
		}


		const {supabase} = requestEvent.locals;
		// :c
		const user = requestEvent.locals.user!;


		const {userLocation, userPurpose, didTypePurpose} = parsedForm;
		const currentTime = new Date().toISOString();


		const {error} = await supabase.from("location_logs")
			.insert({
				timestamp: currentTime,
				google_user_id: user.id,

				location: userLocation,
				purpose: userPurpose,
				did_type_purpose: didTypePurpose
			});


		if(error) {
			console.error(...submitLocationLogPrefix, "Error submitting location", error);
		}

		return {
			error: error !== null,
			message: "succeed"
		};
	}
}
