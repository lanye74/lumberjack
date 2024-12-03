import createCookieManager from "$utils/createCookieManager.js";
import parseSubmitLocationForm from "$utils/forms/parseSubmitLocationForm.js";
import {submitLocationLogPrefix} from "$utils/console.js";

import type {TimeSelector} from "$types/forms";



export async function load({cookies, locals: {supabase, user}}) {
	const currentProfile = await createCookieManager(cookies, supabase).getProfile(user!.id);


	return {
		currentProfile
	}
}



// TODO: this is the worst thing ever and needs to be refactored
export const actions = {
	submitLocation: async ({cookies, locals, request}) => {
		console.log("received")

		const formData = await request.formData();
		const parsedForm = parseSubmitLocationForm(formData);

		if(parsedForm.isValid === false) {
			return {
				error: true,
				message: parsedForm.errorMessage
			};
		}


		const {supabase} = locals;
		const user = locals.user!;


		const {userLocation, userPurpose, didTypePurpose, userProfile, logTime} = parsedForm;

		const logTimestamp = generateTimestampFromTimeSelector(logTime);


		const {error: submitLocationError} = await supabase.from(`${userProfile}_location_logs`)
			.insert({
				timestamp: logTimestamp,
				google_user_id: user.id,

				location: userLocation,
				purpose: userPurpose,
				did_type_purpose: didTypePurpose,
				did_use_custom_time: logTime !== null
			});


		if(submitLocationError) {
			console.error(...submitLocationLogPrefix, "Error submitting location", submitLocationError);

			return {
				error: true,
				message: "Unable to submit location! Please try again."
			};
		}



		const {data: newPoints, error: incrementPointsError} = await supabase.rpc("increment_user_points", {
			google_user_id: user.id,
			profile: userProfile,
			amount: 1000
		});


		if(incrementPointsError) {
			console.error(...submitLocationLogPrefix, "Error incrementing points", incrementPointsError);

			return {
				error: true,
				message: "Your location was logged, but we couldn’t update your points!"
			};
		}


		// IMPORTANT
		// let the server know to not serve a cached leadboard read
		createCookieManager(cookies).setLogSubmissionStatus(true);
		createCookieManager(cookies).setProfilePoints(userProfile, newPoints);



		return {
			error: false,
			message: "Success! You’ve earned 1,000 points!"
		};
	}
}



// TODO: refactor this into wherever it should go
function generateTimestampFromTimeSelector(timeSelector: TimeSelector | null) {
	const dateObject = new Date();

	if(timeSelector === null) return dateObject.toISOString();

	const {hours, minutes, period} = timeSelector;

	dateObject.setHours(hours % 12 + (period === "AM" ? 0 : 12));
	dateObject.setMinutes(minutes);

	dateObject.setSeconds(0);
	dateObject.setMilliseconds(0);


	return dateObject.toISOString();
}
