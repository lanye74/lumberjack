import AuthManager from "./AuthManager.js";
import UserManager from "./UserManager.js";

import type {SupabaseClient} from "@supabase/supabase-js";



export default class SupabaseManager {
	clientData: ClientInitOptions;
	client: SupabaseClient<any, "public", any>

	authManager: AuthManager;
	userManager: UserManager;

	// oklch(60% 0.2 240) in SRGB space
	// logPrefix = ["%c[SupabaseManager]", "color: #0089c9; font-weight: 900;"];

	constructor(clientData: ClientInitOptions) {
		this.clientData = clientData;

		this.client = supabase.createClient(clientData.url, clientData.key);

		this.authManager = new AuthManager(this.client);

		// TODO: i really don't like that this is here, but i have a bit of an architecture problem
		// this is really bad code smell. i need to fix it sooner rather than later or it'll bite me in the ass
		// i wish that javascript was a little bet less nebulous about how data is passed around
		// missing rust references...
		this.userManager = new UserManager(this.client, this.authManager);
	}

	bindSubmitLocation(input: HTMLInputElement, button: HTMLButtonElement) {
		button.addEventListener("click", () => this.userManager.addLogToTracker.call(this.userManager, input.value));
	}

	bindSignInTo(button: HTMLButtonElement) {
		button.addEventListener("click", () => this.authManager.signIn.apply(this.authManager));
	}

	bindSignOutTo(button: HTMLButtonElement) {
		button.addEventListener("click", () => this.authManager.signOut.apply(this.authManager));
	}

	/* private error(message: string, error?: PostgrestError) {
		const args: any[] = [...this.logPrefix, message];
		// so undefined doesn't show up in console
		if(error) args.push(error);

		console.error(...args);

		return error;
	}

	private log(...content: any[]) {
		console.log(...this.logPrefix, ...content);
	} */
}



type ClientInitOptions = {
	url: string;
	key: string;
}
