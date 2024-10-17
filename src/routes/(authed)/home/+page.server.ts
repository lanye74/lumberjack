import createCookieManager from "$lib/createCookieManager.js";
import {parseSubmitLocationForm} from "$lib/parseSubmitLocationForm.js";
import type {ProfilePrefix} from "$lib/profiles.js";
import {submitLocationLogPrefix} from "$lib/consoleColorPrefixes.js";
import type {TimeSelector} from "$lib/time.js";



export async function load({cookies, locals: {supabase, user}}) {
	const currentProfile = await createCookieManager(cookies, supabase).getProfile(user!.id);


	return {
		currentProfile
	}
}



// TODO: this is the worst thing ever and needs to be refactored
export const actions = {
	submitLocation: async ({cookies, locals, request}) => {
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

		// type hack, unfortunately
		if(userProfile === "") {
			// TODO: re-separate out the types of pSLF
			return;
		}


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

		createCookieManager(cookies).setProfilePoints(userProfile as ProfilePrefix, newPoints);



		return {
			error: false,
			message: "Success! You’ve earned 1,000 points!"
		};
	}
}



function generateTimestampFromTimeSelector(timeSelector: TimeSelector | null) {
	const dateObject = new Date();

	if(timeSelector === null) return dateObject.toISOString();

	const {hours: hour, minutes: minute, period} = timeSelector;

	dateObject.setHours(hour % 12 + (period === "AM" ? 0 : 12));
	dateObject.setMinutes(minute);

	dateObject.setSeconds(0);
	dateObject.setMilliseconds(0);

	return dateObject.toISOString();
}
