import {error} from "@sveltejs/kit";

import createCookieManager from "$lib/createCookieManager.js";
import {mapPrettyNameToProfilePrefix, profilePretties} from "$lib/profiles.js";
import type {ProfilePretty} from "$lib/types/profiles.js";



export async function load({cookies, locals: {supabase, user}}) {
	// TODO: Promise.all?
	const currentProfile = await createCookieManager(cookies, supabase).getProfile(user!.id);
	const profilePoints = await createCookieManager(cookies, supabase).getProfilePoints(currentProfile, user!.id);


	return {
		profilePoints,
		currentProfile
	};
}



export const actions = {
	swapProfile: async ({cookies, locals: {supabase, user}, request}) => {
		// TODO: pull user points
		const formData = await request.formData();

		const profilePretty = formData.get("new-profile")?.toString() as ProfilePretty | undefined;
		const currentProfile = mapPrettyNameToProfilePrefix(profilePretty);

		// TODO: make this check run client side lmao
		if(profilePretty === undefined || !profilePretties.includes(profilePretty)) {
			// TODO: make this not return an error and instead be sensible
			return error(400, "No profile provided!");
		}


		const changeProfileResponse = await supabase.from("public_user_data")
			.upsert({profile: currentProfile})
			.eq("google_user_id", user!.id);


		if(changeProfileResponse.error) {
			return error(500, "Unable to update your profile!");
		}


		createCookieManager(cookies).setProfile(currentProfile);

		const profilePoints = await createCookieManager(cookies, supabase).getProfilePoints(currentProfile, user!.id);


		// TODO: rename these
		return {
			profilePoints,
			currentProfile
		}
	}
}
