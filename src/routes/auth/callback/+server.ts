import createCookieManager from "$lib/createCookieManager.js";
import resizeGoogleAvatarUrl from "$lib/resizeGoogleAvatarUrl.js";

import {error, redirect} from "@sveltejs/kit";



export async function GET({cookies, locals: {supabase}, url}) {
	const code = url.searchParams.get("code");
	const next = url.searchParams.get("next") ?? "/";

	if(!code) {
		return redirect(303, "/auth/error");
	}


	const {data, error: codeExchangeResponseError} = await supabase.auth.exchangeCodeForSession(code);

	if(codeExchangeResponseError) {
		console.error("Code exchange response error while logging in!", codeExchangeResponseError);

		return redirect(303, "/auth/error");
	}


	const user = data.user!;


	if(!user.email?.endsWith("@jessamine.kyschools.us") &&
	   !user.email?.endsWith("@stu.jessamine.kyschools.us")) {
		// TODO: use return new Response(message, {status: 403})

		console.error("Invalid domain: user tried to sign in with email", user.email);

		// TODO: error check this too
		await supabase.auth.signOut();

		return error(403, "You must be part of the JCS domain to access this server!");
	}


	const {full_name, avatar_url} = user!.user_metadata;
	const {id: google_user_id} = user!;


	const avatarUrlResized = resizeGoogleAvatarUrl(avatar_url);


	// TODO: can i access the `auth` schema --> identities table myself and not have to keep my own copy?
	// i really need to dig into how sensible (read: experienced) people do this

	// shouldn't need to worry about upserting/insert points because it has a default value of 0
	const updatePublicDataResponse = await supabase.from("public_user_data")
		.upsert({google_user_id, full_name, avatar_url: avatarUrlResized});



	if(updatePublicDataResponse.error) {
		// whatever bro
		// TODO: nicer error handling
		console.error("Failed to update user data", updatePublicDataResponse.error);
		return error(500, "Error while updating your data!");
	}



	createCookieManager(cookies).deleteCookies();


	return redirect(303, `/${next.slice(1)}`);
}
