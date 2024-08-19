import type {Session, SupabaseClient, User} from "@supabase/supabase-js";



declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;

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



type LumberjackRoute = "/home" | "/editor" | "/leaderboard" | "/profile";
