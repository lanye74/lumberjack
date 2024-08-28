import {authStateLogPrefix} from "$lib/consoleColorPrefixes.js";

import {error, redirect} from "@sveltejs/kit";



export async function POST({locals: {supabase}}) {
	const {error: err} = await supabase.auth.signOut();


	if(err) {
		console.error(...authStateLogPrefix, "Error logging out", err);
		return error(500, "Unable to logout");
	}


	return redirect(303, "/");
}
