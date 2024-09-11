import {leaderboardLogPrefix} from "$lib/consoleColorPrefixes.js";
import type {PointsLeaderboardEntry, PointsLeaderboardEntryRow, LoadLeaderboardOutput} from "$lib/types/database.js";
import type {SupabaseClient} from "@supabase/supabase-js";



let cachedDatabaseState: LoadLeaderboardOutput = {
	leaderboard: null
};



const autoRefreshPeriod = 1e3 * 60 * 3; // 3 mins

let lastRefreshTime: number = 0;



// TODO: make this non-blocking and use skeleton loaders
export async function load({cookies, locals: {supabase}}) {
	const hasSubmittedPointsRecently = cookies.get("lumberjack_has_submitted_points_recently")?.toString();
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



async function readDatabase(supabase: SupabaseClient): Promise<PointsLeaderboardEntry[] | null> {
	// baby's first join operation :)
	// TODO: probably make this sql operation a constant
	// TODO: i don't need to fetch googleUserId, really
	const getTopUsersByPointsResponse = await supabase.from("ast_leaderboard")
		.select(`
			points,
			public_user_data (
				google_user_id,
				full_name,
				avatar_url
			)
		`)
		.order("points", {ascending: false})
		.limit(10);

	if(getTopUsersByPointsResponse.error) {
		// whatever bro
		console.error(...leaderboardLogPrefix, getTopUsersByPointsResponse.error);
		return null;
	}


	// TODO: typescript doesn't believe me for some reason
	const topPoints = <PointsLeaderboardEntryRow[]><unknown>getTopUsersByPointsResponse.data;


	// TODO: i hate converting naming conventions
	return topPoints.map<PointsLeaderboardEntry>(user => ({
		googleUserId: user.public_user_data.google_user_id,
		fullName: user.public_user_data.full_name,
		avatarUrl: user.public_user_data.avatar_url ?? "", // if things goes terribly wrong in login this could be null
		points: user.points
	}));
}
