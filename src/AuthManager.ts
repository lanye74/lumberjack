import type {AuthError, Session, SupabaseClient, User} from "@supabase/supabase-js";



export default class AuthManager {
	client: SupabaseClient;

	authState: AuthState = "SIGNED_OUT";
	authStateCallback?: (state: AuthState) => any;
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


		const session = await this.getSession();

		if(!session) {
			return this.setAuthState("SIGNED_OUT");
		}


		return this.setAuthState("SIGNED_IN", session.user);
	}

	async signOut() {
		const {error} = await this.client.auth.signOut();

		if(error !== null) {
			this.error("signing out", error);
			return this.authState;
		}

		// is it better to call updateState here? i don't want to flood my quotas
		return this.setAuthState("SIGNED_OUT");
	}

	async getSession() {
		// TODO: possibly store this if it's important
		const {data, error} = await this.client.auth.getSession();

		// meh
		if(error !== null) {
			// console.log("No session found");
			this.error("checking state", error);
			return null;
		}

		if(!data.session) {
			this.session = null;
			this.setAuthState("SIGNED_OUT");
			return null;
		}


		this.session = data.session;
		this.setAuthState("SIGNED_IN", data.session.user);

		return data.session;
	}

	// called with ("SIGNED_IN", user) or ("SIGNED_OUT")
	private setAuthState(state: AuthState, user: User | null = null) {
		const isAuthStateUnchanged = this.authState === state;

		this.authState = state;
		this.user = user;


		if(isAuthStateUnchanged) {
			this.log(`State unchanged (${this.authState})`);
		} else {
			this.log(`Changing state from ${this.authState} to ${state}`);
			this.authStateCallback?.(state);
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
