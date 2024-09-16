import {error} from "@sveltejs/kit";

import createCookieManager from "$lib/createCookieManager.js";
import {profilePrefixes, type ProfilePrefix} from "$lib/profiles.js";



export async function load({cookies, locals: {supabase, user}}) {
	// TODO: Promise.all?
	const profilePrefix = await createCookieManager(cookies, supabase).getProfile(user!.id);
	const profilePoints = await createCookieManager(cookies, supabase).getProfilePoints(profilePrefix, user!.id);


	return {
		profilePoints,
		profilePrefix
	};
}



export const actions = {
	swapProfile: async ({cookies, locals: {supabase, user}, request}) => {
		const formData = await request.formData();

		const profilePrefix = formData.get("new-profile")?.toString() as ProfilePrefix | undefined;

		// TODO: make this check run client side lmao
		if(profilePrefix === undefined || !profilePrefixes.includes(profilePrefix)) {
			// TODO: make this not return an error and instead be sensible
			return error(400, "No profile provided!");
		}


		const changeProfileResponse = await supabase.from("public_user_data")
			.upsert({profile: profilePrefix})
			.eq("google_user_id", user!.id);


		if(changeProfileResponse.error) {
			// TODO: do better
			return error(500, "Unable to update your profile!");
		}


		createCookieManager(cookies).setProfile(profilePrefix);

		const profilePoints = await createCookieManager(cookies, supabase).getProfilePoints(profilePrefix, user!.id);


		return {
			profilePoints,
			profilePrefix
		}
	}
}
