import type {Session, SupabaseClient, User} from "@supabase/supabase-js";
import "unplugin-icons/types/svelte";

import type {Database} from "$lib/types/supabase.js";
import type {TypedSupabaseClient} from "$lib/types/database.js";



declare global {
	namespace App {
		interface Locals {
			supabase: TypedSupabaseClient;

			safeGetSession: () => Promise<SessionData>;

			session: Session | null;
			user: User | null;
		}

		interface PageData {
			session: SessionData | null;
		}
	}
}



type SessionData = {
	session: Session | null;
	user: User | null;
};
