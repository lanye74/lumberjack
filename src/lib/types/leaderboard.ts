import type {PointsLeaderboardEntry} from "./database.js";
import type {ProfilePrefix} from "./profiles.js";



export type CachedLeaderboard = {
	lastRefreshTime: number;
	cachedState: PointsLeaderboardEntry[] | null;
};



export type LeaderboardCache = {
	[key in ProfilePrefix]: CachedLeaderboard;
};

