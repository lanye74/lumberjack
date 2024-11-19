import {SupabaseClient} from "@supabase/supabase-js";

import type {NestedSnakeToCamelCase} from "$utils/casing.js";

import type {Database, Tables} from "$types/supabase.js";



export type TypedSupabaseClient = SupabaseClient<Database>;

export type LocationLog = NestedSnakeToCamelCase<Tables<"ast_location_logs">>;


type UserPublicInfo = NestedSnakeToCamelCase<Tables<"public_user_data">>;

// TODO: is this okay
export type UserDataWithPoints = {points: number} & Omit<UserPublicInfo, "profile">;
export type UserNameWithPoints = {
	fullName: string;
	points: number
};
