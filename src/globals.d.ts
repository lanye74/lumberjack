// install types with npm w/ --save-dev
import * as supabaseImport from "@supabase/supabase-js";



declare global {
	const supabase: typeof supabaseImport;
}
