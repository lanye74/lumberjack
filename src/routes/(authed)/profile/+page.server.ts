import {error} from "@sveltejs/kit";

import cookieManager from "$lib/cookies.js";
import {defaultProfilePrefix, mapPrettyNameToProfilePrefix, profilePretties} from "$lib/profiles.js";
import type {LoadProfileAndPointsOutput} from "$lib/types/database.js";
import type {ProfilePretty} from "$lib/types/profiles.js";



export async function load({cookies, locals: {supabase, user}}) {
	let output: LoadProfileAndPointsOutput = {
		points: null,
		profile: defaultProfilePrefix
	};


	// TODO: Promise.all?
	const profilePrefix = await cookieManager(cookies, supabase).getProfile(user!.id);
	output.profile = profilePrefix;

	const currentProfilePoints = await cookieManager(cookies, supabase).updatePoints(profilePrefix, user!.id);
	output.points = currentProfilePoints;


	return output;
}



export const actions = {
	swapProfile: async ({cookies, locals: {supabase, user}, request}) => {
		// TODO: pull user points
		const formData = await request.formData();

		const profilePretty = formData.get("new-profile")?.toString() as ProfilePretty | undefined;
		const profilePrefix = mapPrettyNameToProfilePrefix(profilePretty);

		// TODO: make this check run client side lmao
		if(profilePretty === undefined || !profilePretties.includes(profilePretty)) {
			// TODO: make this not return an error and instead be sensible
			return error(400, "No profile provided!");
		}


		const changeProfileResponse = await supabase.from("public_user_data")
			.upsert({profile: profilePrefix})
			.eq("google_user_id", user!.id);


		if(changeProfileResponse.error) {
			return error(500, "Unable to update your profile!");
		}


		cookieManager(cookies).setProfile(profilePrefix);

		const currentProfilePoints = await cookieManager(cookies, supabase).updatePoints(profilePrefix, user!.id);


		// TODO: rename these
		return {
			profile: profilePrefix,
			points: currentProfilePoints
		}
	}
}
