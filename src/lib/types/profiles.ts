import type {Enums} from "$types/supabase.js";



export type ProfilePrefix = Enums<"Profiles">;
// TODO: is there a better way to do this?
export type ProfilePretty = "AST" | "Maintenance";
