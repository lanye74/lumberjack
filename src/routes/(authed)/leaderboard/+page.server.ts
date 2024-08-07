export async function load(loadEvent) {
	const supabase = loadEvent.locals.supabase;
	// if we made it this far, i.e. we were authed in the hook and thus allowed to access this, then of course we're still authed here
	// so we don't need to worry about verifying that we have a session/user etc

	// do some stuff here to organize the top 3/5/20/whatever here idc does it really matter in the grand scheme of things
	// maybe i'll store something like a reset time in a separate table cause neither of the other tables are really designed to have that stuff put in it


	// TODO: error handling here
	// TODO: (2) figure out how to write this in a nice way because this fucking sucks
	const getTopPointsResponse = await supabase.from("points")
		.select()
		.order("points", {ascending: false})
		.limit(5);

	if(getTopPointsResponse.error) {
		// whatever bro
	}


	const topPoints = getTopPointsResponse.data as GetTopPointsResponse;
	const topPointsGUUIDs = topPoints.map(person => person.google_user_id);


	const getUserInfoResponse = await supabase.from("user_public_info")
		.select()
		.in("google_user_id", topPointsGUUIDs);

	if(getUserInfoResponse.error) {
		// whatever bro
	}

	const userInfo = getUserInfoResponse.data as GetUserPublicInfoResponse;



	const output: LeaderboardResults = [];


	// ewwwwwwwwww
	for(const [index, gUUID] of topPointsGUUIDs.entries()) {
		const relevantUserInfo = userInfo.filter(user => user.google_user_id === gUUID)[0];
		const points = topPoints.filter(user => user.google_user_id === gUUID)[0].points;

		output[index] = {
			googleUserId: gUUID,
			fullName: relevantUserInfo.full_name,
			avatarUrl: relevantUserInfo.avatar_url,
			points
		};
	}


	return {
		leaderboard: output
	};
}



type LeaderboardResults = {
	googleUserId: string;
	fullName: string;
	avatarUrl: string;

	points: number;
}[];



type GetTopPointsResponse = {
	google_user_id: string;
	points: number;
}[];



type GetUserPublicInfoResponse = {
	google_user_id: string;
	full_name: string;
	avatar_url: string;
}[];
