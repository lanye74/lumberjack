import {submitLocationPrefix} from "$lib/consoleColorPrefixes.js";



export const actions = {
	// TODO: PLEASEEEEEE VALIdATE THIS GRAHHGHGHGHHHHHH
	submitLocation: async (requestEvent) => {
		const currentTime = new Date().toISOString();

		const formData = await requestEvent.request.formData();

		const {supabase} = requestEvent.locals;
		// :c
		const user = requestEvent.locals.user!;


		const userLocation = formData.get("location-selector")!;


		const userPurposeMultiple = formData.get("purpose-selector")!;
		// null if disabled (i.e., null when userPurposeMultiple !== "Other")
		const userPurposeText = formData.get("location-purpose");

		const userPurpose = (userPurposeMultiple !== "Other") ? userPurposeMultiple : userPurposeText!;



		const {error} = await supabase.from("location_logs")
			.insert({
				timestamp: currentTime,
				google_user_id: user.id,

				location: userLocation,
				purpose: userPurpose,
				was_typed: userPurposeMultiple === "Other"
			});


		if(error) {
			console.error(...submitLocationPrefix, "Error submitting location", error);
		}

		return {
			error: error !== null
		};
	}
}
