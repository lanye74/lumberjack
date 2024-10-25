import {leaderboardLogPrefix} from "$utils/console.js";
import {shallowSnakeCasedToCamelCasedObject} from "$utils/casing.js";

import type {PointsLeaderboardEntry, TypedSupabaseClient} from "$types/database.js";
import type {ProfilePrefix} from "$types/profiles.js";



export default async function fetchLeaderboardEntries(supabase: TypedSupabaseClient, leaderboardPrefix: ProfilePrefix) {
	// baby's first join operation :)
	// TODO: probably make this sql operation a constant
	const getTopUsersByPointsResponse = await supabase.from(`${leaderboardPrefix}_leaderboard`)
		.select(`
			points,
			public_user_data (
				google_user_id,
				full_name,
				avatar_url
			)
		`)
		.order("points", {ascending: false})
		.limit(10);


	if(getTopUsersByPointsResponse.error) {
		// whatever bro
		console.error(...leaderboardLogPrefix, getTopUsersByPointsResponse.error);
		return null;
	}


	return getTopUsersByPointsResponse.data.map(user => ({
		...(shallowSnakeCasedToCamelCasedObject(user.public_user_data)),
		points: user.points
	// TODO: unfortunate necessary typing
	// TODO: (2) make avatarUrl non-nullable and provide a default
	})) as PointsLeaderboardEntry[];
}
