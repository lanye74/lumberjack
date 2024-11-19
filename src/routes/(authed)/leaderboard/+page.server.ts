import AvatarAtlasGenerator from "$utils/AvatarAtlasGenerator.js";
import {avatarSize} from "$utils/resizeGoogleAvatarUrl.js";
import createCookieManager from "$utils/createCookieManager.js";
import fetchLeaderboardEntries from "$utils/database/leaderboard.js";

import type {LeaderboardCache} from "$types/leaderboard.js";
import type {UserNameWithPoints, UserDataWithPoints, TypedSupabaseClient} from "$types/database.js";
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

const avatarAtlasGenerator = new AvatarAtlasGenerator({
	width: avatarSize,
	height: avatarSize,
	quality: 0.8
});



// TODO: use skeleton loaders
export async function load({cookies, locals: {supabase, user}}) {
	const hasSubmittedPointsRecently = createCookieManager(cookies).getLogSubmissionStatus();
	createCookieManager(cookies).setLogSubmissionStatus(false);

	// this should never not be set because of the hook, so this shouldn't be blocking
	const currentProfile = await createCookieManager(cookies, supabase).getProfile(user!.id);


	const leaderboardDataPromise = loadLeaderboardData(supabase, currentProfile, hasSubmittedPointsRecently);


	const avatarAtlasPromise = leaderboardDataPromise
		.then(leaderboardData => avatarAtlasGenerator.getAtlasFromLeaderboardData(leaderboardData));

	const strippedleaderboardDataPromise = leaderboardDataPromise
		.then(leaderboardData => leaderboardData?.map(user => {
			const {avatarUrl: _, googleUserId: __, ...rest} = user;
			return rest;
		}) ?? null) satisfies Promise<null | UserNameWithPoints[]>;


	return {
		leaderboard: strippedleaderboardDataPromise,
		avatarAtlas: avatarAtlasPromise,
	};
}



// compile user icons into atlas when serving from leaderboard
async function loadLeaderboardData(supabase: TypedSupabaseClient, currentProfile: ProfilePrefix, hasSubmittedPointsRecently: boolean): Promise<UserDataWithPoints[] | null> {
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
	const dataFromLeaderboard = await fetchLeaderboardEntries(supabase, currentProfile);
	// i still don't trust pass by reference
	leaderboards[currentProfile] = {
		cachedState: dataFromLeaderboard,
		lastRefreshTime: Date.now()
	};


	return dataFromLeaderboard;
}
