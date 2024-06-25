// import {createClient} from "@supabase/supabase-js";

const url = "https://gikuvqhvhuuooyegmotc.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpa3V2cWh2aHV1b295ZWdtb3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyNTgxMDMsImV4cCI6MjAzNDgzNDEwM30.inuy_1Id_T9M2sebgE05e-7ltiEBvFmiqUOjqQTgicw";



const client = supabase.createClient(url, key);



async function signInWithGoogle() {
	const {data, error} = await client.auth.signInWithOAuth({
		provider: "google"
	});

	if(error) {
		console.error(`Error logging in with OAuth!: ${error}`);
	} else {
		console.log(`Data received! ${data}`);
	}
}



console.log("hey");
