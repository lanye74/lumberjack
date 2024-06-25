// import {createClient} from "@supabase/supabase-js";

import SupabaseManager from "./SupabaseManager.js";

const url = "https://gikuvqhvhuuooyegmotc.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpa3V2cWh2aHV1b295ZWdtb3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyNTgxMDMsImV4cCI6MjAzNDgzNDEwM30.inuy_1Id_T9M2sebgE05e-7ltiEBvFmiqUOjqQTgicw";



const manager = new SupabaseManager({url, key});



async function signInWithGoogle() {
	const state = await manager.auth.signIn();
	console.log("State after logging in:", state);
}



async function signOut() {
	const state = await manager.auth.signOut();
	console.log("State after signing out:", state);
}



const signInButton = document.getElementById("google-sso") as HTMLButtonElement;
const signOutButton = document.getElementById("sign-out") as HTMLButtonElement;

signInButton.addEventListener("click", signInWithGoogle);
signOutButton.addEventListener("click", signOut)

console.log("hey");



(async () => {
	const state = await manager.auth.verifyState();
	console.log("State on page load:", state);
})();
