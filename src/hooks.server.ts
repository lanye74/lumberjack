import {PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL} from "$env/static/public";

import {type Cookies, type Handle, redirect} from "@sveltejs/kit";
import {type CookieMethodsServer, createServerClient} from "@supabase/ssr";
import {sequence} from "@sveltejs/kit/hooks";

import type {RedirectableRoute, RedirectMap} from "$lib/types/routes.js";



const supabaseHandle: Handle = async({event, resolve}) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: generateSupabaseClientCookieMethods(event.cookies)
	});

	// i don't trust javascript setting stuff by reference so i'm destructuring it after setting
	const {locals: {supabase}} = event;


	event.locals.safeGetSession = async () => {
		// check for the existence of a session
		const {data: {session}} = await supabase.auth.getSession();
		if(!session) return {session: null, user: null};


		// validate the session
		const {data: {user}, error} = await supabase.auth.getUser();
		if(error) return {session: null, user: null};


		return {session, user};
	}



	const allowedHeaders = ["content-range", "x-supabase-api-version"];

	return resolve(event, {
		filterSerializedResponseHeaders: (name) => allowedHeaders.includes(name)
	});
}



const authGuardHandle: Handle = async({event: requestEvent, resolve}) => {
	const sessionData = await requestEvent.locals.safeGetSession();
	const {session, user} = sessionData;
	const {locals, url} = requestEvent;

	locals.session = session;
	locals.user = user;


	const redirectIfNotAuthenticated = !session ? "/auth" : null;
	const redirectIfAuthenticated = session ? "/home" : null;

	const defaultRedirect = session ? "/home" : "/auth";


	const redirectMap: RedirectMap = {
		"/": "/home", // always route this to home i cba to make a proper homepage /auth is good enough

		"/auth": redirectIfAuthenticated,
		"/auth/error": null,

		"/home": redirectIfNotAuthenticated,
		// "/editor": redirectIfNotAuthenticated,
		"/editor": "/home",
		"/leaderboard": redirectIfNotAuthenticated,
		"/profile": redirectIfNotAuthenticated
	};


	const redirectPath = redirectMap[url.pathname as RedirectableRoute];


	if(redirectPath) {
		return redirect(303, redirectPath);
	}


	return resolve(requestEvent);
}



function generateSupabaseClientCookieMethods(cookies: Cookies): CookieMethodsServer {
	return {
		getAll: () => cookies.getAll(),

		setAll: (newCookies) => {
			for(const cookie of newCookies) {
				cookies.set(cookie.name, cookie.value, {...cookie.options, path: "/"});
			}
		}
	}
}



export const handle: Handle = sequence(supabaseHandle, authGuardHandle);
