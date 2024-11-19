import {SupabaseClient} from "@supabase/supabase-js";

import type {NestedSnakeToCamelCase} from "$utils/casing.js";

import type {Database, Tables} from "$types/supabase.js";



export type TypedSupabaseClient = SupabaseClient<Database>;

export type LocationLog = NestedSnakeToCamelCase<Tables<"ast_location_logs">>;

export type PointsLeaderboardEntry = {points: number} & Omit<UserPublicInfo, "profile">;

type UserPublicInfo = NestedSnakeToCamelCase<Tables<"public_user_data">>;

// TODO: this is stupid
type BarebonesUser = Omit<UserPublicInfo, "avatarUrl" | "googleUserId" | "profile">

// TODO: these names suck
export type LeaderboardEntryData = BarebonesUser & {points: number};



export type LoadLogsOutput = {
	recentLogs: LocationLog[] | null;
};
