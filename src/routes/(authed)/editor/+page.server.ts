import {logEditorLogPrefix} from "$lib/consoleColorPrefixes.js";



export async function load({locals: {supabase}}) {
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
		console.error(...logEditorLogPrefix, getUserLogs.error);
		return output;
	}


	const recentUserLogs = getUserLogs.data as LocationLogRow[];


	output.recentLogs = recentUserLogs.map<LocationLog>(log => ({
		timestamp: log.timestamp,
		googleUserId: log.google_user_id,
		location: log.location
	}));



	console.log(...logEditorLogPrefix, "Recent logs fetched", output);

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
