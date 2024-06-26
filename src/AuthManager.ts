import type {AuthError, Session, SupabaseClient, User} from "@supabase/supabase-js";



export default class AuthManager {
	client: SupabaseClient;

	authState: AuthState = "SIGNED_OUT";
	authStateCallback?: (state: AuthState) => unknown;
	session: Session | null = null;
	user: User | null = null;

	// hsl(130, 70%, 35%)
	logPrefix = ["%c[Auth Manager]", "color: #1b9830; font-weight: 900;"];

	constructor(client: SupabaseClient) {
		// reference to supabasemanager's client
		this.client = client;
	}

	async signIn() {
		const {error: signInError} = await this.client.auth.signInWithOAuth({provider: "google"});

		if(signInError !== null) {
			this.error("logging in", signInError);
			return this.authState;
		}

		return await this.updateAuthState();
	}

	async signOut() {
		const {error} = await this.client.auth.signOut();

		if(error !== null) {
			this.error("signing out", error);
			return this.authState;
		}

		return await this.updateAuthState();
	}

	async getSession() {
		const {data, error} = await this.client.auth.getSession();

		// meh
		if(error !== null) {
			this.error("fetching session", error);
			return null;
		}


		return data.session ?? null;
	}

	async updateAuthState() {
		const session = await this.getSession();

		if(!session) {
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

	private error(source: string, error: AuthError) {
		console.error(...this.logPrefix, `Error while ${source}:`, error);

		return error;
	}

	private log(...content: any[]) {
		console.log(...this.logPrefix, ...content);
	}
}



export type AuthState = "SIGNED_IN" | "SIGNED_OUT";
