import AuthManager, {type AuthState} from "./AuthManager.js";

import type {SupabaseClient} from "@supabase/supabase-js";



export default class SupabaseManager {
	clientData: ClientInitOptions;
	client: SupabaseClient<any, "public", any>
	auth: AuthManager;

	constructor(clientData: ClientInitOptions) {
		this.clientData = clientData;

		this.client = supabase.createClient(clientData.url, clientData.key);

		this.auth = new AuthManager(this.client);
	}

	async submitLocation(where: string) {
		await this.client.from("location_logs").insert([
			{location: where}
		]);
	}

	bindSubmitLocation(input: HTMLInputElement, button: HTMLButtonElement) {
		button.addEventListener("click", () => this.submitLocation.call(this, input.value));
	}

	bindSignInTo(button: HTMLButtonElement) {
		button.addEventListener("click", () => this.auth.signIn.apply(this.auth));
	}

	bindSignOutTo(button: HTMLButtonElement) {
		button.addEventListener("click", () => this.auth.signOut.apply(this.auth));
	}

	bindAuthStateChangeCallback(callback: (state: AuthState) => unknown) {
		this.auth.authStateCallback = callback;
	}
}



type ClientInitOptions = {
	url: string;
	key: string;
};
