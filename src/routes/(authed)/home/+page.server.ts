import {parseSubmitLocationForm} from "$lib/parseSubmitLocationForm.js";
import {submitLocationLogPrefix} from "$lib/consoleColorPrefixes.js";
import {getUserProfilePrefixCookie, setHasSubmittedLogRecentlyCookie, updateUserPointsCookie} from "$lib/cookies.js";



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
		// :c
		const user = locals.user!;

		// once again, should never not exist. but it could i guess xd
		const profilePrefix = await getUserProfilePrefixCookie(cookies, supabase, user.id);

		const {userLocation, userPurpose, didTypePurpose} = parsedForm;
		const currentTime = new Date().toISOString();


		const {error: submitLocationError} = await supabase.from(`${profilePrefix}_location_logs`)
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


		// TODO: use technique outlined here https://github.com/orgs/supabase/discussions/909#discussioncomment-546117
		// in order to make only one call, instead of reading, then writing
		const {data: readPointsData, error: readPointsError} = await supabase.from(`${profilePrefix}_leaderboard`)
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

		// TODO: is upsert okay here? i only want to update points
		const {error: updatePointsError} = await supabase.from(`${profilePrefix}_leaderboard`)
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
		setHasSubmittedLogRecentlyCookie(cookies, true);

		updateUserPointsCookie(cookies, profilePrefix, points + 1000);



		return {
			error: false,
			message: "Success! You've earned 1,000 points!"
		};
	}
}
