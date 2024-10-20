import {logEditorLogPrefix} from "$utils/console.js";
import {shallowSnakeCasedToCamelCasedObject} from "$utils/casing.js";

import type {LoadLogsOutput, LocationLog} from "$types/database.js";



export async function load({locals: {supabase}}) {
	let output: LoadLogsOutput = {
		recentLogs: null
	};



	const currentTime = new Date();

	// 1000 ms/s * 60s/m * 60m/h * 24h/d * 24d/w
	const searchRangeInWeeks = 1;
	const oneWeekInMilliseconds = 1000 * 60 * 60 * 24 * 7;

	const oneWeekAgo = new Date(currentTime.getTime() - oneWeekInMilliseconds * searchRangeInWeeks);


	const getUserLogs = await supabase.from("ast_location_logs")
		.select()
		.gte("timestamp", oneWeekAgo.toISOString())
		.order("timestamp", {ascending: true});


	if(getUserLogs.error) {
		// whatever bro
		console.error(...logEditorLogPrefix, getUserLogs.error);
		return output;
	}


	const recentUserLogs = getUserLogs.data;

	// TODO: fix types
	output.recentLogs = recentUserLogs.map(log => shallowSnakeCasedToCamelCasedObject(log)) as (LocationLog[] | null);



	console.log(...logEditorLogPrefix, "Recent logs fetched", output);

	return output;
}
