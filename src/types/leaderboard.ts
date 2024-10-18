import type {ProfilePrefix} from "$lib/profiles.js";

import type {PointsLeaderboardEntry} from "$types/database.js";



export type CachedLeaderboard = {
	lastRefreshTime: number;
	cachedState: PointsLeaderboardEntry[] | null;
};



export type LeaderboardCache = Record<ProfilePrefix, CachedLeaderboard>;
