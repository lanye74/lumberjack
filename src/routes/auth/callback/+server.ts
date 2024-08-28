import resizeGoogleAvatarUrl from "$lib/resizeGoogleAvatarUrl.js";

import {error, redirect} from "@sveltejs/kit";



export async function GET({url, locals: {supabase}}) {
	const code = url.searchParams.get("code");
	const next = url.searchParams.get("next") ?? "/";

	if(!code) {
		return redirect(303, "/auth/error");
	}


	const codeExchangeResponse = await supabase.auth.exchangeCodeForSession(code);

	if(codeExchangeResponse.error) {
		return redirect(303, "/auth/error");
	}


	const {data: {user}} = codeExchangeResponse;

	if(!user.email?.endsWith("@jessamine.kyschools.us") ||
	   !user.email?.endsWith("@stu.jessamine.kyschools.us")) {
		// TODO: use return new Response(message, {status: 403})

		// TODO: error check this too
		await supabase.auth.signOut();

		return error(403, "You must be part of the JCS domain to access this server!");
	}


	const {full_name, avatar_url} = user!.user_metadata;
	const {id: google_user_id} = user!;


	const avatarUrlResized = resizeGoogleAvatarUrl(avatar_url);


	// TODO: can i access the `auth` schema --> identities table myself and not have to keep my own copy?
	// i really need to dig into how sensible (read: experienced) people do this
	const updatePublicDataResponse = await supabase.from("public_user_data")
		.upsert({google_user_id, full_name, avatar_url: avatarUrlResized});



	if(updatePublicDataResponse.error) {
		// whatever bro
		// TODO: nicer error handling
		return error(500, "Error while updating your data!");
	}



	return redirect(303, `/${next.slice(1)}`);
}
