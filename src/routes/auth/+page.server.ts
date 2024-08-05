import {redirect} from "@sveltejs/kit";



export const actions = {
	signIn: async (requestEvent) => {
		const {locals} = requestEvent;


		const redirectLocation = new URL("/auth/callback", requestEvent.url);

		console.log(redirectLocation)

		const {data, error} = await locals.supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: redirectLocation.toString()
			}
		});


		if(error) {
			console.error(error);
			return redirect(303, "/auth/error");
		}

		if(!data.url) {
			console.error("No redirect url???!");
			return redirect(303, "/auth/error");
		}


		return redirect(303, data.url);
	}
}
