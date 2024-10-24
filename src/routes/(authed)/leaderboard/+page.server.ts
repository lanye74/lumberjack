import {avatarSize} from "$utils/resizeGoogleAvatarUrl.js";
import createCookieManager from "$utils/createCookieManager.js";
import fetchLeaderboardEntries from "$utils/database/leaderboard.js";
import {TextureAtlas} from "$utils/TextureAtlas.js";

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


	const leaderboardDataPromise = loadLeaderboardData(supabase, currentProfile, hasSubmittedPointsRecently);


	const profileAtlasPromise = leaderboardDataPromise.then(async leaderboardData => {
		if(leaderboardData === null) return null;

		const textureAtlas = new TextureAtlas(avatarSize, avatarSize);
		await textureAtlas.loadImages(leaderboardData.map(user => user.avatarUrl!));

		textureAtlas.constructAtlasFromImages();

		return textureAtlas.export();
	})


	return {
		leaderboard: leaderboardDataPromise,
		imageData: profileAtlasPromise
	};
}



// compile user icons into atlas when serving from leaderboard
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
	const dataFromLeaderboard = await fetchLeaderboardEntries(supabase, currentProfile);
	// i still don't trust pass by reference
	leaderboards[currentProfile].cachedState = dataFromLeaderboard;
	leaderboards[currentProfile].lastRefreshTime = Date.now();


	return dataFromLeaderboard;
}
