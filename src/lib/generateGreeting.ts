export default function generateGreeting() {
	const date = new Date();
	const hour = date.getHours();


	if(hour >= 5 && hour < 12) {
		return "Good morning";
	}

	if(hour >= 12 && hour < 17) {
		return "Good afternoon";
	}

	if(hour >= 17 && hour < 21) {
		return "Good evening";
	}

	return "Welcome";
}
