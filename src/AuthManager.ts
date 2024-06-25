import type {AuthError, SupabaseClient, User} from "@supabase/supabase-js";



export default class AuthManager {
	client: SupabaseClient;
	user: User | null = null;
	authState: AuthState = "SIGNED_OUT";

	constructor(client: SupabaseClient) {
		// reference to supabasemanager's client
		this.client = client;
	}

	async signIn() {
		const {error: signInError} = await this.client.auth.signInWithOAuth({provider: "google"});

		if(signInError !== null) {
			// figure out a better way to write this. should i have a separate signin/signout err method that returns the state?
			this.error("logging in", signInError);
			return this.authState;
		}


		const {data, error: userError} = await this.client.auth.getUser();

		if(userError !== null) {
			this.error("getting user status", userError);
			return this.setAuthState("SIGNED_OUT");
		}


		this.user = data.user;
		return this.authState;
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

	async verifyState() {
		// TODO: possibly store this if it's important
		const session = await this.client.auth.getSession();

		// meh
		if(session.data.session === null) {
			// console.log("No session found");
			return this.setAuthState("SIGNED_OUT");
		}


		// possibly promise.all this?
		const {data, error} = await this.client.auth.getUser();

		if(error !== null) {
			this.error("getting user status", error);
			return this.setAuthState("SIGNED_OUT");
		}


		// console.log("Successfully got user status", data);
		return this.setAuthState("SIGNED_IN", data.user);
	}

	private setAuthState(state: AuthState, user?: User) {
		if(state === this.authState) {
			console.log("State unchanged");
		}

		this.authState = state;
		this.user = (state === "SIGNED_IN") ? user as User : null;

		return this.authState;
	}

	private error(source: string, error: AuthError) {
		console.error(`Error while ${source}:`, error);

		return error;
	}
}



type AuthState = "SIGNED_IN" | "SIGNED_OUT";
