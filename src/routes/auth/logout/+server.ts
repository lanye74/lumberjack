import {authStateLogPrefix} from "$lib/consoleColorPrefixes.js";
import createCookieManager from "$lib/createCookieManager.js";

import {error, redirect} from "@sveltejs/kit";



export async function POST({cookies, locals: {supabase}}) {
	const {error: err} = await supabase.auth.signOut();

	createCookieManager(cookies).deleteCookies();



	if(err) {
		console.error(...authStateLogPrefix, "Error logging out", err);
		return error(500, "Unable to logout");
	}


	return redirect(303, "/");
}
