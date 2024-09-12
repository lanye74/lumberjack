import type {SupabaseClient} from "@supabase/supabase-js";

import {leaderboardLogPrefix} from "$lib/consoleColorPrefixes.js";
import {defaultProfile} from "$lib/profiles.js";
import type {PointsLeaderboardEntry, PointsLeaderboardEntryRow} from "$lib/types/database.js";



// TODO: PLEAAAASE clean this up
const leaderboards = {
	ast: {
		lastRefreshTime: 0,
		cachedState: null
	},

	maint: {
		lastRefreshTime: 0,
		cachedState: null
	}
};



const autoRefreshPeriod = 1e3 * 60 * 3; // 3 mins



// TODO: make this non-blocking and use skeleton loaders
export async function load({cookies, locals: {supabase}}) {
	// TODO: make keyof typeof leaderboards a standard type
	const targetLeaderboardPrefix = (cookies.get("lumberjack_user_profile")?.toString() ?? defaultProfile) as keyof typeof leaderboards;
	const targetLeaderboard = leaderboards[targetLeaderboardPrefix];


	const hasSubmittedPointsRecently = cookies.get("lumberjack_has_submitted_points_recently")?.toString();

	const currentTime = Date.now();


	// use cached response!!!
	if((hasSubmittedPointsRecently === undefined || hasSubmittedPointsRecently === "false") &&
	    targetLeaderboard.cachedState !== null &&
		// true if we are not at the forced refresh period yet
		currentTime < (targetLeaderboard.lastRefreshTime + autoRefreshPeriod)
	) {
		return {
			leaderboard: targetLeaderboard.cachedState
		};
	}


	const dataFromLeaderboard = await readDatabase(supabase, targetLeaderboardPrefix);
	// @ts-ignore
	// TODO: types
	// also, i still don't trust pass by reference
	leaderboards[targetLeaderboardPrefix].cachedState = dataFromLeaderboard;

	leaderboards[targetLeaderboardPrefix].lastRefreshTime = Date.now();

	cookies.set("lumberjack_has_submitted_points_recently", "false", {path: "/"});


	return {
		leaderboard: dataFromLeaderboard
	};
}



async function readDatabase(supabase: SupabaseClient, leaderboardPrefix: string): Promise<PointsLeaderboardEntry[] | null> {
	// baby's first join operation :)
	// TODO: probably make this sql operation a constant
	// TODO: i don't need to fetch googleUserId, really
	const getTopUsersByPointsResponse = await supabase.from(`${leaderboardPrefix}_leaderboard`)
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
