import {manager} from "$lib/main.js"
import {fail} from "@sveltejs/kit";

export const actions = {
	submitLocation: async(routeEvent) => {
		const data = await routeEvent.request.formData();
		const location = data.get("location") as string ?? "";

		if(location.trim() === "") {
			return fail(403, {
				error: "location must not be empty!"
			});
		}

		manager.userManager.addLogToTracker(location);
	}
}
