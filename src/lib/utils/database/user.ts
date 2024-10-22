import {defaultProfilePrefix} from "$utils/profiles.js";

import type {TypedSupabaseClient} from "$types/database.js";
import type {ProfilePrefix} from "$types/profiles.js";



export async function fetchUserPoints(supabase: TypedSupabaseClient, profilePrefix: ProfilePrefix, userId: string) {
	const {data, error} = await supabase.from(`${profilePrefix}_leaderboard`)
		.select("points")
		.eq("google_user_id", userId)
		.single()


	if(error && error.code !== "PGRST116") {
		console.error("Error in fetchUserPoints", error);
		return null;
	}


	return data?.points ?? 0;
}



export async function fetchUserProfile(supabase: TypedSupabaseClient, userId: string) {
	const {data} = await supabase.from("public_user_data")
		.select("profile")
		.eq("google_user_id", userId)
		.single();

	return data?.profile ?? defaultProfilePrefix;
}
