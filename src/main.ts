// import {createClient} from "@supabase/supabase-js";

const url = "https://gikuvqhvhuuooyegmotc.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpa3V2cWh2aHV1b295ZWdtb3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyNTgxMDMsImV4cCI6MjAzNDgzNDEwM30.inuy_1Id_T9M2sebgE05e-7ltiEBvFmiqUOjqQTgicw";



const client = supabase.createClient(url, key);



async function signInWithGoogle() {
	const {error} = await client.auth.signInWithOAuth({
		provider: "google"
	});

	if(error !== null) {
		console.error("Error logging in with OAuth!:", error);
	}


	const user = await getUserStatus();
	console.log("User status after logging in:", user);
}



async function signOut() {
	console.log("Signing out");

	const {error} = await client.auth.signOut();

	if(error !== null) {
		console.error("Error logging out!:", error)
	}


	const user = await getUserStatus();
	console.log("User status after logging out:", user);
}



async function getUserStatus() {
	const {data, error} = await client.auth.getUser();

	if(error !== null) {
		console.error("Error getting user status!:", error);
		return null;
	}

	// console.log("Successfully got user status", data);
	return data;
}



const signInButton = document.getElementById("google-sso") as HTMLButtonElement;
const signOutButton = document.getElementById("sign-out") as HTMLButtonElement;

signInButton.addEventListener("click", signInWithGoogle);
signOutButton.addEventListener("click", signOut)

console.log("hey");



(async () => {
	const user = await getUserStatus();

	if(user === null) {
		// i cba to really handle the error right now
		// or think about the pattern i want to use to do so
		console.error("User unable to be fetched! (Probably signed out)");
		return;
	}

	console.log("User successfully signed in:", user);
})();

