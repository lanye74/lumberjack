export type LoadLogsOutput = {
	recentLogs: LocationLog[] | null;
};

// the Row suffixed types indicate what comes directly out of the database
export type LocationLogRow = {
	timestamp: string;
	google_user_id: string;
	location: string;
};

// the non-Row suffixed types are what i've parsed for use throughout the app
export type LocationLog = {
	timestamp: string;
	googleUserId: string;
	location: string;
};



export type LoadLeaderboardOutput = {
	leaderboard: UserPublicInfo[] | null;
};

export type UserPublicInfoRow = {
	google_user_id: string;
	full_name: string;
	avatar_url: string;
	points: number;
};

export type UserPublicInfo = {
	googleUserId: string;
	fullName: string;
	avatarUrl: string;
	points: number;
};



export type LoadPointsOutput = {
	points: number | null;
}
