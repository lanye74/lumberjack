import {logEditorPrefix} from "$lib/consoleColorPrefixes.js";



export async function load(loadEvent) {
	const supabase = loadEvent.locals.supabase;
	// if we made it this far, i.e. we were authed in the hook and thus allowed to access this, then of course we're still authed here
	// so we don't need to worry about verifying that we have a session/user etc

	let output: LoadLogsOutput = {
		recentLogs: null
	};



	const currentTime = new Date();

	// 1000 ms/s * 60s/m * 60m/h * 24h/d * 24d/w
	const searchRangeInWeeks = 1;
	const oneWeekInMilliseconds = 1000 * 60 * 60 * 24 * 7;

	const oneWeekAgo = new Date(currentTime.getTime() - oneWeekInMilliseconds * searchRangeInWeeks);


	const getUserLogs = await supabase.from("location_logs")
		.select()
		.gte("timestamp", oneWeekAgo.toISOString())
		.order("timestamp", {ascending: true});


	if(getUserLogs.error) {
		// whatever bro
		console.error(...logEditorPrefix, getUserLogs.error);
		return output;
	}


	const recentUserLogs = getUserLogs.data as LocationLogRow[];


	output.recentLogs = recentUserLogs.map<LocationLog>(log => ({
		timestamp: log.timestamp,
		googleUserId: log.google_user_id,
		location: log.location
	}));



	console.log(...logEditorPrefix, "Recent logs fetched", output);

	return output;
}



type LoadLogsOutput = {
	recentLogs: LocationLog[] | null;
};



type LocationLog = {
	timestamp: string;
	googleUserId: string;
	location: string;
};



type LocationLogRow = {
	timestamp: string;
	google_user_id: string;
	location: string;
};
