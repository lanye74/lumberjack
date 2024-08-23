import {authStateLogPrefix} from "$lib/consoleColorPrefixes.js";

import {redirect} from "@sveltejs/kit";



export const actions = {
	signIn: async (requestEvent) => {
		const {locals} = requestEvent;


		const redirectLocation = new URL("/auth/callback", requestEvent.url);


		const {data, error} = await locals.supabase.auth.signInWithOAuth({
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
