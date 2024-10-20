import {error, redirect} from "@sveltejs/kit";

import {authStateLogPrefix} from "$utils/console.js";
import createCookieManager from "$utils/createCookieManager.js";



export async function POST({cookies, locals: {supabase}}) {
	const {error: signOutError} = await supabase.auth.signOut();

	createCookieManager(cookies).deleteCookies();



	if(signOutError) {
		console.error(...authStateLogPrefix, "Error logging out", signOutError);
		return error(500, "Unable to logout");
	}


	return redirect(303, "/");
}
