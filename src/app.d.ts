import * as SupabaseImport from "@supabase/supabase-js";



declare global {
	const supabase: typeof SupabaseImport;
}
