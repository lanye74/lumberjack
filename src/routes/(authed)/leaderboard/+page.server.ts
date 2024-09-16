import type {SupabaseClient} from "@supabase/supabase-js";

import createCookieManager from "$lib/createCookieManager.js";
import type {LeaderboardCache} from "$lib/types/leaderboard.js";
import {leaderboardLogPrefix} from "$lib/consoleColorPrefixes.js";
import type {PointsLeaderboardEntry, PointsLeaderboardEntryRow} from "$lib/types/database.js";



// TODO: PLEAAAASE clean this up
const leaderboards: LeaderboardCache = {
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
export async function load({cookies, locals: {supabase, user}}) {
	// TODO: avoid name collisions here
	const currentProfile = await createCookieManager(cookies, supabase).getProfile(user!.id);
	const leaderboard = leaderboards[currentProfile];


	const hasSubmittedPointsRecently = createCookieManager(cookies).getLogSubmissionStatus();

	const currentTime = Date.now();


	// use cached response!!!
	if((hasSubmittedPointsRecently === false) &&
	    leaderboard.cachedState !== null &&
		// true if we are not at the forced refresh period yet
		currentTime < (leaderboard.lastRefreshTime + autoRefreshPeriod)
	) {
		return {
			leaderboard: leaderboard.cachedState
		};
	}


	const dataFromLeaderboard = await readDatabase(supabase, currentProfile);
	// i still don't trust pass by reference
	leaderboards[currentProfile].cachedState = dataFromLeaderboard;
	leaderboards[currentProfile].lastRefreshTime = Date.now();

	createCookieManager(cookies).setLogSubmissionStatus(false);


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


	// supabase types are convinced public_user_data is an array, so cast to unknown first
	const topPoints = <PointsLeaderboardEntryRow[]><unknown>getTopUsersByPointsResponse.data;


	// TODO: i hate converting naming conventions
	return topPoints.map<PointsLeaderboardEntry>(user => ({
		googleUserId: user.public_user_data.google_user_id,
		fullName: user.public_user_data.full_name,
		avatarUrl: user.public_user_data.avatar_url ?? "", // if things goes terribly wrong in login this could be null
		points: user.points
	}));
}
