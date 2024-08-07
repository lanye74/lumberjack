import {error, redirect} from "@sveltejs/kit";



export const GET = async ({url, locals}) => {
	const code = url.searchParams.get("code");
	const next = url.searchParams.get("next") ?? "/";

	if(!code) {
		return redirect(303, "/auth/error");
	}


	const codeExchangeResponse = await locals.supabase.auth.exchangeCodeForSession(code);

	if(codeExchangeResponse.error) {
		return redirect(303, "/auth/error");
	}


	// update user data

	const user = codeExchangeResponse.data.user;
	const {google_user_id, full_name, avatar_url} = user.user_metadata;

	// TODO: this should become a helper function
	const avatarUrlResized = avatar_url.replace("=s96-c", "=s192-c");


	const updatePublicDataResponse = await locals.supabase.from("user_public_info")
		.upsert({google_user_id, full_name, avatar_url: avatarUrlResized});

	if(updatePublicDataResponse.error) {
		// whatever bro
		return error(500, "Error updating your data!");
	}



	return redirect(303, `/${next.slice(1)}`);
}
