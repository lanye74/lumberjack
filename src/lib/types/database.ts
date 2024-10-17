import {SupabaseClient} from "@supabase/supabase-js";

import type {Database, Tables} from "./supabase.js";
import type {ProfilePrefix} from "../profiles.js";
import type {NestedSnakeToCamelCase} from "$lib/casing.js";



export type TypedSupabaseClient = SupabaseClient<Database>;



export type LoadLogsOutput = {
	recentLogs: LocationLog[] | null;
};

// the Row suffixed types indicate what comes directly out of the database
// note: this is missing fields
// note two: use supabase types => type LLR = Tables<"ast_location_log">
// could possibly remove the type LLR altogether
export type LocationLogRow = Tables<"ast_location_logs">;
// the non-Row suffixed types are what i've parsed for use throughout the app
export type LocationLog = NestedSnakeToCamelCase<LocationLogRow>;



export type LoadLeaderboardOutput = {
	leaderboard: PointsLeaderboardEntry[] | null;
};

export type PointsLeaderboardEntryRow = {
	points: number;
	public_user_data: UserPublicInfoRow;
};

export type PointsLeaderboardEntry = {points: number} & UserPublicInfo;



// type UserPublicInfoRow = {
	// google_user_id: string;
	// full_name: string;
	// avatar_url: string;
// };

export type UserPublicInfoRow = Tables<"public_user_data">;



type UserPublicInfo = {
	googleUserId: string;
	fullName: string;
	avatarUrl: string;
};



export type LoadProfileAndPointsOutput = {
	profilePoints: number | null;
	currentProfile: ProfilePrefix;
};



// TODO: populate this across the database
export type SupabaseWithTypes = SupabaseClient<Database>;
