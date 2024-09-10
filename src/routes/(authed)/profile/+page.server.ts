import {error} from "@sveltejs/kit";

import type {LoadPointsOutput} from "$lib/types/database.js";



export async function load({cookies, locals: {supabase, user}}) {
	let output: LoadPointsOutput = {
		points: null
	};


	let pointsCookie = cookies.get("lumberjack_user_points");

	// please let me use if-let pattern :( why, javascript
	if(pointsCookie !== undefined) {
		output.points = parseInt(pointsCookie);

		return output;
	}



	// TODO: refactor into "readFromDatabase" pattern on leaderboard page
	const getUserPointsResponse = await supabase.from("ast_leaderboard")
		.select()
		.eq("google_user_id", user!.id)
		.single();


	if(getUserPointsResponse.error) {
		// whatever bro
		// console.error(...needAPrefixHere, getUserPointsResponse.error);
		return output;
	}

	output.points = getUserPointsResponse.data.points ?? 0;


	return output;
}



const profiles = ["AST", "Maintenance"];

export const actions = {
	swapProfile: async ({cookies, locals: {supabase, user}, request}) => {
		const formData = await request.formData();

		const selectedProfile = formData.get("new-profile")?.toString();

		// TODO: make this check run client side lmao
		if(selectedProfile === undefined || !profiles.includes(selectedProfile)) {
			// TODO: make this not return an error and instead be sensible
			return error(400, "No profile provided!");
		}


		const changeProfileResponse = await supabase.from("public_user_data")
			.upsert({profile: selectedProfile})
			.eq("google_user_id", user!.id);


		if(changeProfileResponse.error) {
			return error(500, "Unable to update your profile!");
		}


		cookies.set("lumberjack_user_profile", selectedProfile, {path: "/"});
	}
}
