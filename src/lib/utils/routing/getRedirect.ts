import type {Session} from "@supabase/supabase-js";

import {authedRoutes} from "$utils/routing/maps.js";

import type {AuthedRoute, RedirectableRoute} from "$types/routing.js";



export default function getRedirect(url: URL, session?: Session | null) {
	const requestedPath = url.pathname as RedirectableRoute;


	// always route / to home i cba to make a proper homepage /auth is good enough
	// also route /auth to /home if we are authed
	if(requestedPath === "/" ||
	   (requestedPath === "/auth" && session)) {
		return "/home";
	}

	// routes must be authententicated, route to /auth if not
	if(authedRoutes.includes(requestedPath as AuthedRoute) && !session) {
		return "/auth";
	}


	return null;
}
