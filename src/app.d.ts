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
			session: MaybeNull<SessionData>;
		}
	}
}



type MaybeNull<T> = T | null;

type SessionData = {
	session: MaybeNull<Session>;
	user: MaybeNull<User>;
};
