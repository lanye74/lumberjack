import AuthManager from "./AuthManager.js";

import type {PostgrestError, SupabaseClient} from "@supabase/supabase-js";



export default class SupabaseManager {
	clientData: ClientInitOptions;
	client: SupabaseClient<any, "public", any>
	auth: AuthManager;

	// oklch(60% 0.2 240) in SRGB space
	logPrefix = ["%c[SupabaseManager]", "color: #0089c9; font-weight: 900;"];

	constructor(clientData: ClientInitOptions) {
		this.clientData = clientData;

		this.client = supabase.createClient(clientData.url, clientData.key);

		this.auth = new AuthManager(this.client);
	}

	async submitLocation(location: string) {
		// the response of this is PostgrestSingleResponse<null>,
		// so the data value (if it succeeds) is null. no need to destructure it out
		if(this.auth.authState !== "SIGNED_IN") {
			this.error("Unable to submit location, not signed in");
			return;
		}


		const {error: submitLocationError} = await this.client
			.from("location_logs")
			.insert([{location}]);

		if(submitLocationError !== null) {
			this.error("Error while submitting location", submitLocationError);
			return;
		}

		this.log(`Successfully logged location ${location}`);

		await this.incrementPoints(1000);
	}

	async incrementPoints(value: number) {
		this.log("Fetching points");

		const {data, error: fetchedPointsError} = await this.client
			.from("user_data")
			.select("points")
			.eq("google_user_id", this.auth.user!.id)
			.single();

		if(fetchedPointsError !== null) {
			// PGRST116 = no rows found, so data hasn't been initialized
			// only error out if we actually ran into something bad
			if(fetchedPointsError.code !== "PGRST116") {
				this.error("Error while fetching stored points value", fetchedPointsError);
				return;
			}

			this.log("User data row doesn't exist, creating");
		}

		// if nothing was read, set it to 0
		const fetchedPointsValue = (data?.points ?? 0) as number;


		this.log(`Stored points value is ${fetchedPointsValue}, updating`);

		const {error: defaultPointsValueError} = await this.client
			.from("user_data")
			.upsert({google_user_id: this.auth.user!.id, points: fetchedPointsValue + value});

		if(defaultPointsValueError !== null) {
			this.error("Error while updating points", defaultPointsValueError);
			return;
		}


		this.log(`Points updated successfully; new value is ${fetchedPointsValue + value}`);
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

	private error(message: string, error?: PostgrestError) {
		const args: any[] = [...this.logPrefix, message];
		// so undefined doesn't show up in console
		if(error) args.push(error);

		console.error(...args);

		return error;
	}

	private log(...content: any[]) {
		console.log(...this.logPrefix, ...content);
	}
}



type ClientInitOptions = {
	url: string;
	key: string;
}
