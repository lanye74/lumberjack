import type {ProfilePrefix} from "$types/profiles.js";

import type {PointsLeaderboardEntry} from "$types/database.js";



export type CachedLeaderboard = {
	lastRefreshTime: number;
	cachedState: PointsLeaderboardEntry[] | null;
};



export type LeaderboardCache = Record<ProfilePrefix, CachedLeaderboard>;
