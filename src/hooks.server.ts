import {PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL} from "$env/static/public";

import {type Cookies, type Handle, redirect} from "@sveltejs/kit";
import {type CookieMethodsServer, createServerClient} from "@supabase/ssr";
import {sequence} from "@sveltejs/kit/hooks";



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


	const redirectsToAuth = !session ? "/auth" : null;
	const redirectsToHome = session ? "/home" : null;


	// TODO: make a unified route type... [key in PossibleRoute] not ideal
	// also PossibleRoute has /(authed)/ which i don't need... eughh
	const redirectMap: {[route: string]: string | null} = {
		"/": "/home", // always route this to home i cba to make a proper homepage /auth is good enough
		"/auth": redirectsToHome,

		"/home": redirectsToAuth,
		// "/editor": redirectsToAuth,
		"/editor": "/home",
		"/leaderboard": redirectsToAuth,
		"/profile": redirectsToAuth
	};


	const redirectPath = redirectMap[url.pathname];

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
