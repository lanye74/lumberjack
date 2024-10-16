import {PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL} from "$env/static/public";
import {createBrowserClient, createServerClient, isBrowser} from "@supabase/ssr";



export async function load({depends, data, fetch}) {
	depends("supabase:auth");


	const supabase = isBrowser() === true
		? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {global: {fetch}})
		: createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
			global: {fetch},
			cookies: {getAll: () => data.cookies}
		});


	const {data: {session}} = await supabase.auth.getSession();
	const {data: {user}} = await supabase.auth.getUser();


	return {
		supabase,

		session,
		user
	}
}
