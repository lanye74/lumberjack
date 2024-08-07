import {PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL} from "$env/static/public";

import {type Cookies, type Handle, redirect} from "@sveltejs/kit";
import {type CookieMethodsServer, createServerClient} from "@supabase/ssr";
import {sequence} from "@sveltejs/kit/hooks";



const supabaseHandle: Handle = async({event: requestEvent, resolve}) => {
	requestEvent.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: generateSupabaseClientCookieMethods(requestEvent.cookies)
	});

	// i don't trust javascript setting stuff by reference so i'm destructuring it after setting
	const {locals: {supabase}} = requestEvent;


	requestEvent.locals.safeGetSession = async () => {
		// check for the existence of a session
		const {data: {session}} = await supabase.auth.getSession();
		if(!session) return {session: null, user: null};


		// validate the session
		const {data: {user}, error} = await supabase.auth.getUser();
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


	// perhaps to no great surprise, i still have trust issues approximately 30 lines later
	const {locals: {session}, url} = requestEvent;

	// whatever idc i'll rename them later (kappa)
	const authDependentPaths = ["/home", "/logger", "/leaderboard", "/profile"];

	if(!session && authDependentPaths.includes(url.pathname)) {
		return redirect(303, "/auth");
	}

	if(session && url.pathname === "/auth") {
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
