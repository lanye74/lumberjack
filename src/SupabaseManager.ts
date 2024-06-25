import type {AuthError, SupabaseClient, User} from "@supabase/supabase-js";



export default class SupabaseManager {
	clientData: ClientData;
	client: SupabaseClient<any, "public", any>
	auth: AuthManager;

	constructor(clientData: ClientData) {
		this.clientData = clientData;

		this.client = supabase.createClient(clientData.url, clientData.key);

		this.auth = new AuthManager(this.client);
	}
}



class AuthManager {
	client: SupabaseClient;
	state: AuthState = "SIGNED_OUT";
	error: AuthError | null = null;
	user: User | null = null;

	constructor(client: SupabaseClient) {
		// reference to supabasemanager's client
		this.client = client;
	}

	async signIn() {
		const {error} = await this.client.auth.signInWithOAuth({provider: "google"});

		if(error !== null) {
			console.error("Error logging in!:", error);
			return error;
		}

		const {data, error: userError} = await this.client.auth.getUser();

		// figure out what to do with this
		if(userError !== null) {
			console.error("Error getting user status!:", error);

			this.state = "SIGNED_OUT";
			this.user = null;

			return this.state;
		}

		this.user = data.user;
	}

	async signOut() {
		const {error} = await this.client.auth.signOut();

		if(error !== null) {
			console.error("Error logging out!:", error);
			return error;
		}

		// is it better to call updateState here? i don't want to flood my quotas
		this.user = null;
		this.state = "SIGNED_OUT";
	}

	async updateState() {
		const session = await this.client.auth.getSession();

		// meh
		if(session.data.session === null) {
			// console.log("No session found");

			// TODO: possibly an internal setState method
			this.state = "SIGNED_OUT";
			this.user = null;

			return this.state;
		}

		// possibly promise.all this?
		const {data, error} = await this.client.auth.getUser();

		if(error !== null) {
			console.error("Error getting user status!:", error);

			this.state = "SIGNED_OUT";
			this.user = null;

			return this.state;
		}

		// console.log("Successfully got user status", data);
		this.state = "SIGNED_IN";
		this.user = data.user;

		return this.state;
	}
}



type ClientData = {
	url: string;
	key: string;
}

type AuthState = "SIGNED_IN" | "SIGNED_OUT";
