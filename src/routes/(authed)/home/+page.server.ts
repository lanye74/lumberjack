import createCookieManager from "$lib/createCookieManager.js";
import {parseSubmitLocationForm} from "$lib/parseSubmitLocationForm.js";
import {submitLocationLogPrefix} from "$lib/consoleColorPrefixes.js";



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
		const dateObject = new Date();

		const didUseCustomTime = logTime !== null;

		if(didUseCustomTime) {
			const {hours, minutes, seconds, period} = logTime;

			dateObject.setHours(hours % 12 + (period === "AM" ? 0 : 12));
			dateObject.setMinutes(minutes);
			dateObject.setSeconds(seconds);
		}



		const {error: submitLocationError} = await supabase.from(`${userProfile}_location_logs`)
			.insert({
				timestamp: dateObject.toISOString(),
				google_user_id: user.id,

				location: userLocation,
				purpose: userPurpose,
				did_type_purpose: didTypePurpose,
				did_use_custom_time: didUseCustomTime
			});


		if(submitLocationError) {
			console.error(...submitLocationLogPrefix, "Error submitting location", submitLocationError);

			return {
				error: true,
				message: "Unable to submit location! Please try again."
			};
		}


		// TODO: use technique outlined here https://github.com/orgs/supabase/discussions/909#discussioncomment-546117
		// in order to make only one call, instead of reading, then writing
		const {data: readPointsData, error: readPointsError} = await supabase.from(`${userProfile}_leaderboard`)
			.select("points")
			.eq("google_user_id", user.id)
			.single();


		// PGRST116: no rows found. happens for first time entries on the leaderboard
		if(readPointsError && readPointsError.code !== "PGRST116") {
			console.error(...submitLocationLogPrefix, "Error reading points", readPointsError);

			return {
				error: true,
				message: "Your location was logged, but we couldn't update your points!"
			};
		}


		const points = (readPointsData?.points ?? 0) as number;

		const {error: updatePointsError} = await supabase.from(`${userProfile}_leaderboard`)
			.upsert({google_user_id: user.id, points: points + 1000})
			.eq("google_user_id", user.id);


		if(updatePointsError) {
			console.error(...submitLocationLogPrefix, "Error updating points", updatePointsError);

			return {
				error: true,
				message: "Your location was logged, but we couldn't update your points!"
			};
		}



		// IMPORTANT
		// let the server know to not serve a cached leadboard read
		createCookieManager(cookies).setLogSubmissionStatus(true);

		createCookieManager(cookies).setProfilePoints(userProfile, points + 1000);



		return {
			error: false,
			message: "Success! You've earned 1,000 points!"
		};
	}
}
