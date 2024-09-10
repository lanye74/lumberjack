export type LoadLogsOutput = {
	recentLogs: LocationLog[] | null;
};

// the Row suffixed types indicate what comes directly out of the database
export type LocationLogRow = {
	timestamp: string;
	google_user_id: string;
	location: string;
	purpose: string;
	did_type_purpose: boolean;
};

// the non-Row suffixed types are what i've parsed for use throughout the app
export type LocationLog = {
	timestamp: string;
	googleUserId: string;
	location: string;
	purpose: string;
	didTypePurpose: boolean;
};



export type LoadLeaderboardOutput = {
	leaderboard: PointsLeaderboardEntry[] | null;
};

// TODO: clean up these types
export type PointsLeaderboardEntryRow = {
	points: number;
	public_user_data: UserPublicInfoRow;
};

export type PointsLeaderboardEntry = UserPublicInfo & {points: number};



type UserPublicInfoRow = {
	google_user_id: string;
	full_name: string;
	avatar_url: string;
};

type UserPublicInfo = {
	googleUserId: string;
	fullName: string;
	avatarUrl: string;
};



export type LoadPointsOutput = {
	points: number | null;
}
