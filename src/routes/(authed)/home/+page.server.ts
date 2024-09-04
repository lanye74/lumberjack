import {parseSubmitLocationForm} from "$lib/parseSubmitLocationForm.js";
import {submitLocationLogPrefix} from "$lib/consoleColorPrefixes.js";



// TODO: this is the worst thing ever and needs to be refactored
export const actions = {
	submitLocation: async (requestEvent) => {
		const formData = await requestEvent.request.formData();
		const parsedForm = parseSubmitLocationForm(formData);

		if(parsedForm.isValid === false) {
			return {
				error: true,
				message: parsedForm.errorMessage
			};
		}


		const {supabase} = requestEvent.locals;
		// :c
		const user = requestEvent.locals.user!;


		const {userLocation, userPurpose, didTypePurpose} = parsedForm;
		const currentTime = new Date().toISOString();


		const {error: submitLocationError} = await supabase.from("location_logs")
			.insert({
				timestamp: currentTime,
				google_user_id: user.id,

				location: userLocation,
				purpose: userPurpose,
				did_type_purpose: didTypePurpose
			});


		if(submitLocationError) {
			console.error(...submitLocationLogPrefix, "Error submitting location", submitLocationError);

			return {
				error: true,
				message: "Unable to submit location! Please try again."
			};
		}


		const {data: readPointsData, error: readPointsError} = await supabase.from("public_user_data")
			.select("points")
			.eq("google_user_id", user.id)
			.single();


		if(readPointsError) {
			console.error(...submitLocationLogPrefix, "Error reading points", readPointsError);

			return {
				error: true,
				message: "Your location was logged, but we couldn't update your points!"
			};
		}


		const points = (readPointsData?.points ?? 0) as number;

		const {error: updatePointsError} = await supabase.from("public_user_data")
			.update({points: points + 1000})
			.eq("google_user_id", user.id);


		if(updatePointsError) {
			console.error(...submitLocationLogPrefix, "Error submitting location", updatePointsError);

			return {
				error: true,
				message: "Your location was logged, but we couldn't update your points!"
			};
		}



		// IMPORTANT
		// let the server know to not serve a cached leadboard read
		requestEvent.cookies.set("lumberjack_has_submitted_points_recently", "true", {path: "/"});


		return {
			error: false,
			message: "Success! You've earned 1,000 points!"
		};
	}
}
