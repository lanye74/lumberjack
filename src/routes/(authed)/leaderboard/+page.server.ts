import createCookieManager from "$utils/createCookieManager.js";
import {leaderboardLogPrefix} from "$utils/console.js";
import {shallowSnakeCasedToCamelCasedObject} from "$utils/casing.js";

import type {LeaderboardCache} from "$types/leaderboard.js";
import type {PointsLeaderboardEntry, TypedSupabaseClient} from "$types/database.js";
import type {ProfilePrefix} from "$types/profiles.js";



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



// TODO: use skeleton loaders
export async function load({cookies, locals: {supabase, user}}) {
	const hasSubmittedPointsRecently = createCookieManager(cookies).getLogSubmissionStatus();
	createCookieManager(cookies).setLogSubmissionStatus(false);

	// this should never not be set because of the hook, so this shouldn't be blocking
	const currentProfile = await createCookieManager(cookies, supabase).getProfile(user!.id);


	return {
		leaderboard: loadLeaderboardData(supabase, currentProfile, hasSubmittedPointsRecently)
	};
}



async function loadLeaderboardData(supabase: TypedSupabaseClient, currentProfile: ProfilePrefix, hasSubmittedPointsRecently: boolean): Promise<PointsLeaderboardEntry[] | null> {
	const leaderboard = leaderboards[currentProfile];
	const currentTime = Date.now();

	// use cached response!!!
	if((hasSubmittedPointsRecently === false) &&
	   leaderboard.cachedState !== null &&
		// true if we are not at the forced refresh period yet
		currentTime < (leaderboard.lastRefreshTime + autoRefreshPeriod)
	) {
		return leaderboard.cachedState;
	}


	// TODO: if i read the database, i probably should set the user's points cookie, if they're on the leaderboard
	const dataFromLeaderboard = await readDatabase(supabase, currentProfile);
	// i still don't trust pass by reference
	leaderboards[currentProfile].cachedState = dataFromLeaderboard;
	leaderboards[currentProfile].lastRefreshTime = Date.now();


	return dataFromLeaderboard;
}



async function readDatabase(supabase: TypedSupabaseClient, leaderboardPrefix: ProfilePrefix) {
	// baby's first join operation :)
	// TODO: probably make this sql operation a constant
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


	return getTopUsersByPointsResponse.data.map(user => ({
		...(shallowSnakeCasedToCamelCasedObject(user.public_user_data)),
		points: user.points
	// TODO: unfortunate necessary typing
	})) as PointsLeaderboardEntry[];
}
