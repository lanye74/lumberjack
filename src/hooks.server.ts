import {PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL} from "$env/static/public";

import {type Cookies, type Handle, redirect} from "@sveltejs/kit";
import {type CookieMethodsServer, createServerClient} from "@supabase/ssr";
import {sequence} from "@sveltejs/kit/hooks";



const supabaseHandle: Handle = async({event: requestEvent, resolve}) => {
	requestEvent.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: generateSupabaseClientCookieMethods(requestEvent.cookies)
	});


	requestEvent.locals.safeGetSession = async () => {
		// check for the existence of a session
		const {data: {session}} = await requestEvent.locals.supabase.auth.getSession();
		if(!session) return {session: null, user: null};


		// validate the session
		const {data: {user}, error} = await requestEvent.locals.supabase.auth.getUser();
		if(error) return {session: null, user: null};


		return {session, user};
	}



	const allowedHeaders = ["content-range", "x-supabase-api-version"];

	return resolve(requestEvent, {
		filterSerializedResponseHeaders: (name) => allowedHeaders.includes(name)
	});
}



const authGuardHandle: Handle = async({event: requestEvent, resolve}) => {
	const sessionData = await requestEvent.locals.safeGetSession();

	[requestEvent.locals.session, requestEvent.locals.user] = [sessionData.session, sessionData.user];


	// whatever idc i'll rename them later (kappa)
	const authDependentPaths = ["/home", "/logger", "/scoreboard", "/profile"];

	if(!requestEvent.locals.session && authDependentPaths.includes(requestEvent.url.pathname)) {
		return redirect(303, "/auth");
	}

	if(requestEvent.locals.session && requestEvent.url.pathname === "/auth") {
		return redirect(303, "/home");
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
