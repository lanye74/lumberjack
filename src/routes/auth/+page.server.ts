import {redirect} from "@sveltejs/kit";

import {authStateLogPrefix} from "$lib/consoleColorPrefixes.js";



export const actions = {
	signIn: async ({url, locals: {supabase}}) => {
		const redirectLocation = new URL("/auth/callback", url.origin);


		const {data, error} = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: redirectLocation.toString()
			}
		});


		if(error) {
			console.error(...authStateLogPrefix, "Error logging in:", error);
			return redirect(303, "/auth/error");
		}

		if(!data.url) {
			console.error(...authStateLogPrefix, "No redirect url?!", data);
			return redirect(303, "/auth/error");
		}


		return redirect(303, data.url);
	}
}
