import {error, fail} from "@sveltejs/kit";

import createCookieManager from "$utils/createCookieManager.js";
import {profilePrefixes} from "$utils/profiles.js";

import type {ProfilePrefix} from "$types/profiles.js";



export async function load({cookies, locals: {supabase, user}}) {
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

		if(profilePrefix === undefined || !profilePrefixes.includes(profilePrefix)) {
			console.error(`Error swapping profiles: trying to swap to "${profilePrefix}"`);

			return fail(400, {
				message: "Invalid profile provided!"
			});
		}


		const changeProfileResponse = await supabase.from("public_user_data")
			.upsert({profile: profilePrefix})
			.eq("google_user_id", user!.id);


		if(changeProfileResponse.error) {
			console.error("Supabase error while swapping profiles", changeProfileResponse.error);

			return fail(500, {
				message: "Unable to update your profile!"
			});
		}


		createCookieManager(cookies).setProfile(profilePrefix);

		const profilePoints = await createCookieManager(cookies, supabase).getProfilePoints(profilePrefix, user!.id);


		return {
			profilePoints,
			profilePrefix
		}
	}
}
