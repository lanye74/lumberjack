import {logEditorLogPrefix} from "$utils/console.js";
import {shallowSnakeCasedToCamelCasedObject} from "$utils/casing.js";

import type {LocationLog} from "$types/database.js";



export async function load({locals: {supabase}}) {
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
		return {
			recentLogs: null
		};
	}


	const recentUserLogs = getUserLogs.data;

	// TODO: fix types
	const recentLogs = recentUserLogs.map(log => shallowSnakeCasedToCamelCasedObject(log)) as (LocationLog[] | null);



	console.log(...logEditorLogPrefix, "Recent logs fetched", recentLogs);

	return {
		recentLogs
	}
}
