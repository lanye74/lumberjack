import AuthManager, {type AuthState} from "./AuthManager.js";

import type {SupabaseClient} from "@supabase/supabase-js";



export default class SupabaseManager {
	clientData: ClientInitOptions;
	client: SupabaseClient<any, "public", any>
	auth: AuthManager;
	// signInClickListener:

	constructor(clientData: ClientInitOptions) {
		this.clientData = clientData;

		this.client = supabase.createClient(clientData.url, clientData.key);

		this.auth = new AuthManager(this.client);
	}

	bindSignInTo(element: HTMLButtonElement) {
		element.addEventListener("click", () => this.auth.signIn.apply(this.auth));
	}

	bindSignOutTo(element: HTMLButtonElement) {
		element.addEventListener("click", () => this.auth.signOut.apply(this.auth));
	}

	bindAuthStateChangeCallback(callback: (state: AuthState) => any) {
		this.auth.authStateCallback = callback;
	}
}



type ClientInitOptions = {
	url: string;
	key: string;
};
