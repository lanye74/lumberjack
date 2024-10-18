import {SupabaseClient} from "@supabase/supabase-js";

import type {Database, Tables} from "$lib/types/supabase.js";
import type {NestedSnakeToCamelCase} from "$lib/casing.js";



export type TypedSupabaseClient = SupabaseClient<Database>;

export type LocationLog = NestedSnakeToCamelCase<Tables<"ast_location_logs">>;

export type PointsLeaderboardEntry = {points: number} & UserPublicInfo;

type UserPublicInfo = NestedSnakeToCamelCase<Tables<"public_user_data">>;



export type LoadLogsOutput = {
	recentLogs: LocationLog[] | null;
}
