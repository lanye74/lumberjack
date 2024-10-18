import type {PointsLeaderboardEntry} from "$lib/types/database.js";
import type {ProfilePrefix} from "$lib/profiles.js";



export type CachedLeaderboard = {
	lastRefreshTime: number;
	cachedState: PointsLeaderboardEntry[] | null;
};



export type LeaderboardCache = Record<ProfilePrefix, CachedLeaderboard>;
