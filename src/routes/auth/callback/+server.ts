import {redirect} from "@sveltejs/kit";



export const GET = async ({url, locals}) => {
	const code = url.searchParams.get("code");
	const next = url.searchParams.get("next") ?? "/";

	if(!code) {
		return redirect(303, "/auth/error");
	}


	const {error} = await locals.supabase.auth.exchangeCodeForSession(code);

	if(error) {
		return redirect(303, "/auth/error");
	}


	return redirect(303, `/${next.slice(1)}`);
}
