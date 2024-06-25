import AuthManager from "./AuthManager.js";

import type {SupabaseClient} from "@supabase/supabase-js";



export default class SupabaseManager {
	clientData: ClientInitOptions;
	client: SupabaseClient<any, "public", any>
	auth: AuthManager;

	constructor(clientData: ClientInitOptions) {
		this.clientData = clientData;

		this.client = supabase.createClient(clientData.url, clientData.key);

		this.auth = new AuthManager(this.client);
		this.auth.verifyState();
	}
}



type ClientInitOptions = {
	url: string;
	key: string;
};
