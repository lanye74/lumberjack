import {leaderboardLogPrefix} from "$lib/consoleColorPrefixes.js";
import type {LoadLeaderboardOutput, UserPublicInfo, UserPublicInfoRow} from "$lib/types/database.js";



// TODO: make this non-blocking and use skeleton loaders
export async function load({locals: {supabase}}) {
	// if we made it this far, i.e. we were authed in the hook and thus allowed to access this, then of course we're still authed here
	// so we don't need to worry about verifying that we have a session/user etc

	let output: LoadLeaderboardOutput = {
		leaderboard: null
	};



	const getTopUsersByPointsResponse = await supabase.from("public_user_data")
		.select()
		.order("points", {ascending: false})
		.limit(10);

	if(getTopUsersByPointsResponse.error) {
		// whatever bro
		console.error(...leaderboardLogPrefix, getTopUsersByPointsResponse.error);
		return output;
	}


	const topPoints = getTopUsersByPointsResponse.data as UserPublicInfoRow[];


	// TODO: i hate converting naming conventions
	output.leaderboard = topPoints.map<UserPublicInfo>(user => ({
		googleUserId: user.google_user_id,
		fullName: user.full_name,
		avatarUrl: user.avatar_url,
		points: user.points
	}));



	// console.log(...leaderboardLogPrefix, "Leaderboard state fetched successfully", output);

	return output;
}
