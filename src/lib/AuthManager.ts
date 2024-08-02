import type {AuthError, Session, SupabaseClient, User} from "@supabase/supabase-js";



// TODO: find a **nice** way to cleanly handle the types of authState, session, and user
// perhaps wrapping them in their own object...?
// i played with generics on the class but it just felt painful honestly

export default class AuthManager {
	client: SupabaseClient;

	authStateCallback?: (state: AuthState) => unknown;

	authState: AuthState = "SIGNED_OUT";
	session: Session | null = null;
	user: User | null = null;

	// oklch(60% 0.2 150) in SRGB space
	logPrefix = ["%c[AuthManager]", "color: #009e36; font-weight: 900;"];

	constructor(client: SupabaseClient) {
		// reference to supabasemanager's client
		this.client = client;
	}

	async signIn() {
		const {error} = await this.client.auth.signInWithOAuth({provider: "google"});

		if(error !== null) {
			this.error("logging in", error);
			return this.authState;
		}

		return await this.updateAuthState();
	}

	async signOut() {
		const {error} = await this.client.auth.signOut();

		if(error !== null) {
			this.error("Error while signing out:", error);
			return this.authState;
		}

		return await this.updateAuthState();
	}

	async getSession() {
		const {data, error} = await this.client.auth.getSession();

		if(error !== null) {
			this.error("Error while fetching session:", error);
			return null;
		}

		return data.session;
	}

	async updateAuthState() {
		const session = await this.getSession();

		if(!session) { // longing for an if-let pattern or zig-style if (expr) |capture|...
			return this.setAuthState("SIGNED_OUT");
		}

		return this.setAuthState("SIGNED_IN", session);
	}

	// called with ("SIGNED_IN", session) or ("SIGNED_OUT")
	private setAuthState(newAuthState: AuthState, session?: Session) {
		this.log(`State update BEFORE ${this.authState} AFTER ${newAuthState}`);
		const authStateChanged = this.authState !== newAuthState;

		this.authState = newAuthState;
		this.session = session ?? null;
		this.user = session?.user ?? null;


		if(authStateChanged) {
			this.authStateCallback?.(newAuthState);
		}


		return this.authState;
	}

	private error(message: string, error: AuthError) {
		console.error(...this.logPrefix, message, error);

		return error;
	}

	private log(...content: any[]) {
		console.log(...this.logPrefix, ...content);
	}
}



export type AuthState = "SIGNED_IN" | "SIGNED_OUT";
