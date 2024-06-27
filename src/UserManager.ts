import AuthManager from "./AuthManager.js";

import type {PostgrestError, SupabaseClient} from "@supabase/supabase-js";



export default class UserManager {
	client: SupabaseClient;
	authManager: AuthManager;

	currentPoints: number | null = null;
	pointsUpdateCallback?: (points: number) => unknown;

	// oklch(60% 0.2 30) in SRGB space
	logPrefix = ["%c[UserManager]", "color: #de3e2d; font-weight: 900;"];

	constructor(client: SupabaseClient, authManager: AuthManager) {
		this.client = client;
		this.authManager = authManager;
	}

	async addLogToTracker(location: string) {
		if(this.authManager.authState !== "SIGNED_IN") {
			this.error("Unable to add log, not signed in");
			return;
		}


		// TODO: implement some semblance of good error handling patterns here
		const submitLocationError = await this.submitLocation(location);
		if(submitLocationError) return;

		const incrementPointsError = await this.incrementPoints(1000);
		if(incrementPointsError) return;
	}

	async submitLocation(location: string) {
		const {error} = await this.client
			.from("location_logs")
			.insert([{location}]);

		if(error !== null) {
			return this.error("Error while submitting location", error);
		}


		this.log(`Successfully logged location ${location}`);
	}

	// this whole mess should really be done server-side if possible
	async getPoints() {
		this.log("Fetching points");

		// possibly this is bad but when i implement leaderboard resets,
		// this should only ever ruin everything if someone... has the open as it resets
		// and if that's the case i can probably force them to reload
		if(this.currentPoints !== null) {
			return this.currentPoints;
		}


		const userId = this.authManager.user!.id;

		const {data, error} = await this.client
			.from("user_data")
			.select("points")
			.eq("google_user_id", userId)
			.single();

		if(error !== null) {
			// PGRST116 = no rows found, so data hasn't been initialized
			// only error out if we actually ran into something bad
			if(error.code !== "PGRST116") {
				this.error("Error while fetching stored points value", error);
				// TODO: better error handle this (please)
				// this shouldn't ever happen but PLEASE fix it
				return Number.NEGATIVE_INFINITY;
			}

			this.log("User data row doesn't exist, creating");
		}


		// if nothing was read (i.e. row DNE), set it to 0
		const points = (data?.points ?? 0) as number;
		this.pointsUpdateCallback?.(points);

		return points;
	}

	async incrementPoints(value: number) {
		const fetchedPointsValue = await this.getPoints();
		const newPointsValue = fetchedPointsValue + value;

		this.log(`Stored points value is ${fetchedPointsValue}, updating`);

		const userId = this.authManager.user!.id;

		const {error} = await this.client
			.from("user_data")
			.upsert({google_user_id: userId, points: newPointsValue});

		if(error !== null) {
			return this.error("Error while updating points", error);
		}


		this.log(`Points updated successfully; new value is ${newPointsValue}`);

		// everything is ok, probably, so
		this.currentPoints = newPointsValue;

		this.pointsUpdateCallback?.(this.currentPoints);
	}

	// TODO: add a logger class that abstracts these away
	// and then extend it/implement it/whatever
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
