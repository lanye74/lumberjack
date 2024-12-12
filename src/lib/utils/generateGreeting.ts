import type {User} from "@supabase/supabase-js";



export default function generateGreeting(user: User) {
	const hour = new Date().getHours();


	let salutation = "";

	if(hour >= 5 && hour < 12) {
		salutation = "Good morning";
	} else if(hour >= 12 && hour < 17) {
		salutation = "Good afternoon";
	} else if(hour >= 17 && hour < 21) {
		salutation = "Good evening";
	} else {
		salutation = "Hey";
	}


	const firstName = (user.user_metadata.full_name as string).split(" ")[0];

	return `${salutation}, ${firstName}!`;
}
