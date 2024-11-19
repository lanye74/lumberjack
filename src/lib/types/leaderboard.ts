import type {ProfilePrefix} from "$types/profiles.js";

import type {UserDataWithPoints} from "$types/database.js";



export type CachedLeaderboard = {
	lastRefreshTime: number;
	cachedState: UserDataWithPoints[] | null;
};



export type LeaderboardCache = Record<ProfilePrefix, CachedLeaderboard>;
