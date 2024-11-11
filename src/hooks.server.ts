import {PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL} from "$env/static/public";

import {type Cookies, type Handle, redirect} from "@sveltejs/kit";
import {type CookieMethodsServer, createServerClient} from "@supabase/ssr";
import {sequence} from "@sveltejs/kit/hooks";

import fs from "node:fs";
import path from "node:path";

import createCookieManager from "$utils/createCookieManager.js";

import type {RedirectableRoute, RedirectMap} from "$types/routing.js";



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



const acmeChallengeHandle: Handle = async({event: requestEvent, resolve}) => {
	const requestUrl = requestEvent.url.pathname;

	if(requestUrl.startsWith("/.well-known/acme-challenge/")) {
		const filePath = path.join("C:\\LAYNE\\acme-challenge\\", requestUrl);
		console.log("[acmeChallengeHandle] Resolving ACME challenge", requestUrl.split("/").pop());

		if(fs.existsSync(filePath)) {
			const fileContent = fs.readFileSync(filePath, "utf-8");
			return new Response(fileContent, {status: 200});
		}
	}


	return resolve(requestEvent);
}



const authGuardHandle: Handle = async({event: requestEvent, resolve}) => {
	const {session, user} = await requestEvent.locals.safeGetSession();
	const {locals, url} = requestEvent;

	locals.session = session;
	locals.user = user;


	const mustBeAuthenticated = !session ? "/auth" : null;
	const mustNotBeAuthenticated = session ? "/home" : null;


	const redirectMap: RedirectMap = {
		"/": "/home", // always route this to home i cba to make a proper homepage /auth is good enough

		"/auth": mustNotBeAuthenticated,
		"/auth/error": null,

		"/home": mustBeAuthenticated,
		// "/editor": redirectIfNotAuthenticated,
		"/editor": "/home",
		"/leaderboard": mustBeAuthenticated,
		"/profile": mustBeAuthenticated,
		// TODO: shouldn't need to be authenticated, but I don't have a landing page
		"/about": mustBeAuthenticated
	};


	const redirectPath = redirectMap[url.pathname as RedirectableRoute];


	if(redirectPath) {
		return redirect(303, redirectPath);
	}


	return resolve(requestEvent);
}



const setProfileCookieHandle: Handle = async ({event: requestEvent, resolve}) => {
	const {session, supabase} = requestEvent.locals;

	if(!session) {
		return resolve(requestEvent);
	}

	// this will set it if it does not exist (for real this time)
	await createCookieManager(requestEvent.cookies, supabase).getProfile(requestEvent.locals.user!.id);

	return resolve(requestEvent);
}



function generateSupabaseClientCookieMethods(cookies: Cookies): CookieMethodsServer {
	return {
		getAll: () => cookies.getAll(),

		setAll: (newCookies) => {
			newCookies.forEach(cookie => cookies.set(cookie.name, cookie.value, {...cookie.options, path: "/"}))
		}
	}
}



export const handle = sequence(supabaseHandle, acmeChallengeHandle, authGuardHandle, setProfileCookieHandle);
