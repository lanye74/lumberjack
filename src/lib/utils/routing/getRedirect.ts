import type {Session} from "@supabase/supabase-js";

import type {RedirectMap, RedirectableRoute} from "$types/routing.js";



export default function getRedirect(url: string, session?: Session | null) {
	const mustBeAuthenticated = !session ? "/auth" : null;
	const mustNotBeAuthenticated = session ? "/home" : null;


	const redirectMap: RedirectMap = {
		"/": "/home", // always route this to home i cba to make a proper homepage /auth is good enough

		"/auth": mustNotBeAuthenticated,
		"/auth/error": null,

		"/home": mustBeAuthenticated,
		// "/editor": redirectIfNotAuthenticated,
		// "/editor": "/home",
		"/form": mustBeAuthenticated,
		"/leaderboard": mustBeAuthenticated,
		"/profile": mustBeAuthenticated,
		// TODO: shouldn't need to be authenticated, but I don't have a landing page
		"/about": mustBeAuthenticated
	};


	const redirectPath = redirectMap[url as RedirectableRoute];

	return redirectPath;
}


