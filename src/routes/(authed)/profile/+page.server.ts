import {error} from "@sveltejs/kit";
import type {SupabaseClient} from "@supabase/supabase-js";

import type {LoadProfileAndPointsOutput} from "$lib/types/database.js";
import {defaultProfile, mapPrettyNameToProfilePrefix, prettyProfiles, profiles} from "$lib/profiles.js";



export async function load({cookies, locals: {supabase, user}}) {
	let output: LoadProfileAndPointsOutput = {
		points: null,
		profile: defaultProfile
	};


	// this should never not be set, but in case it isn't
	let profileCookie = cookies.get("lumberjack_user_profile")?.toString();

	const profile = profileCookie ? profileCookie : await fetchUserProfile(supabase, user!.id);

	if(!profileCookie) {
		cookies.set("lumberjack_user_profile", profile, {path: "/"});
	}


	const pointsCookie = cookies.get("lumberjack_user_points")?.toString();
	const pointsJson = JSON.parse(pointsCookie ?? '{"ast": null,"maint":null}');

	output.points = pointsJson[profile] ?? await fetchUserPoints(supabase, profile, user!.id);
	pointsJson[profile] = output.points;

	// TODO: make a cookie manager
	cookies.set("lumberjack_user_points", JSON.stringify(pointsJson), {path: "/"});


	return output;
}



// TODO: standardize this argument name "profile"
async function fetchUserPoints(supabase: SupabaseClient, profile: string, userId: string) {
	const {data, error} = await supabase.from(`${profile}_leaderboard`)
		.select("points")
		.eq("google_user_id", userId)
		.single();


	if(error && error.code !== "PGRST116") {
		return null;
	}


	return data?.points ?? 0;
}



async function fetchUserProfile(supabase: SupabaseClient, userId: string): Promise<string> {
	const {data} = await supabase.from("public_user_data")
		.select("profile")
		.eq("google_user_id", userId)
		.single();

	return (data?.profile ?? defaultProfile) as string;
}



export const actions = {
	swapProfile: async ({cookies, locals: {supabase, user}, request}) => {
		// TODO: pull user points
		const formData = await request.formData();

		const profile = formData.get("new-profile")?.toString();
		const profilePrefix = mapPrettyNameToProfilePrefix(profile);

		// TODO: make this check run client side lmao
		if(profile === undefined || !prettyProfiles.includes(profile)) {
			// TODO: make this not return an error and instead be sensible
			return error(400, "No profile provided!");
		}


		const changeProfileResponse = await supabase.from("public_user_data")
			.upsert({profile: profilePrefix})
			.eq("google_user_id", user!.id);


		if(changeProfileResponse.error) {
			return error(500, "Unable to update your profile!");
		}


		cookies.set("lumberjack_user_profile", profilePrefix, {path: "/"});


		const pointsCookie = cookies.get("lumberjack_user_points")?.toString();
		// TODO: extract this default into an object
		const pointsJson = JSON.parse(pointsCookie ?? '{"ast": null,"maint":null}');

		// TODO: error handling????????
		let pointsValue = pointsJson[profilePrefix] ?? await fetchUserPoints(supabase, profilePrefix, user!.id);
		pointsJson[profilePrefix] = pointsValue;

		// TODO: make a cookie manager
		cookies.set("lumberjack_user_points", JSON.stringify(pointsJson), {path: "/"});


		return {
			profile: profilePrefix,
			points: pointsValue
		}
	}
}
