import {leaderboardLogPrefix} from "$lib/consoleColorPrefixes.js";
import type {LoadLeaderboardOutput, UserPublicInfo, UserPublicInfoRow} from "$lib/types/database.js";
import type {SupabaseClient} from "@supabase/supabase-js";



let cachedDatabaseState: LoadLeaderboardOutput = {
	leaderboard: null
};



const autoRefreshPeriod = 1e3 * 60 * 3; // 3 mins

let lastRefreshTime: number = 0;



// TODO: make this non-blocking and use skeleton loaders
export async function load({cookies, locals: {supabase}}) {
	// TODO: add an expiry so that a read after x time (probably like thirty mins) will force reload
	const hasSubmittedPointsRecently = cookies.get("lumberjack_has_submitted_points_recently");
	const currentTime = Date.now();

	// use cached response!!!
	if((hasSubmittedPointsRecently === undefined || hasSubmittedPointsRecently === "false") &&
	    cachedDatabaseState.leaderboard !== null &&
		// true if we are not at the forced refresh period yet
		currentTime < (lastRefreshTime + autoRefreshPeriod)
	) {
		return cachedDatabaseState;
	}


	cachedDatabaseState.leaderboard = await readDatabase(supabase);
	lastRefreshTime = Date.now();

	cookies.set("lumberjack_has_submitted_points_recently", "false", {path: "/"});


	return cachedDatabaseState;
}



// TODO: make this sensible and integrate with cache instead of separate output
async function readDatabase(supabase: SupabaseClient) {
	let output: UserPublicInfo[] | null = null;


	const getTopUsersByPointsResponse = await supabase.from("ast_public_user_data")
		.select()
		.order("points", {ascending: false})
		.limit(10);

	if(getTopUsersByPointsResponse.error) {
		// whatever bro
		console.error(...leaderboardLogPrefix, getTopUsersByPointsResponse.error);
		return output;
	}


	const topPoints = getTopUsersByPointsResponse.data as UserPublicInfoRow[];


	// TODO: i hate converting naming conventions
	output = topPoints.map<UserPublicInfo>(user => ({
		googleUserId: user.google_user_id,
		fullName: user.full_name,
		avatarUrl: user.avatar_url ?? "", // if things goes terribly wrong in login this could be null
		points: user.points
	}));



	// console.log(...leaderboardLogPrefix, "Leaderboard state fetched successfully", output);

	return output;
}
