import type {LoadPointsOutput} from "$lib/types/database.js";



// TODO: load this value from a cookie
// this may also become more useful when i add the current user to the bottom of the leaderboard if they're not on it
// or highlight the user with a border if they are
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
	const getUserPointsResponse = await supabase.from("ast_public_user_data")
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
