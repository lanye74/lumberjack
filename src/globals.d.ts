// install types with npm i --save-dev    v
import * as SupabaseImport from "@supabase/supabase-js";



declare global {
	const supabase: typeof SupabaseImport;
}
