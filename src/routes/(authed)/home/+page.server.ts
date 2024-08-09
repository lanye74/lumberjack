

export const actions = {
	submitLocation: async (requestEvent) => {
		const currentTime = new Date().toISOString();
		const formData = await requestEvent.request.formData();


		const userLocation = formData.get("location-selector")!;
		const userPurpose = formData.get("location-purpose")!;

		console.log(formData);
	}
}
