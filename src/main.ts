import SupabaseManager from "./SupabaseManager.js";

import type {AuthState} from "./AuthManager.js";



const url = "https://gikuvqhvhuuooyegmotc.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpa3V2cWh2aHV1b295ZWdtb3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyNTgxMDMsImV4cCI6MjAzNDgzNDEwM30.inuy_1Id_T9M2sebgE05e-7ltiEBvFmiqUOjqQTgicw";

const manager = new SupabaseManager({url, key});


const signInButton = document.getElementById("google-sso") as HTMLButtonElement;
const signOutButton = document.getElementById("sign-out") as HTMLButtonElement;
const welcomeHeader = document.getElementById("welcome-header") as HTMLHeadingElement;
const authStateSpan = document.getElementById("auth-state") as HTMLSpanElement;

manager.bindSignInTo(signInButton);
manager.bindSignOutTo(signOutButton);
manager.bindAuthStateChangeCallback(onAuthStateChange);


function onAuthStateChange(state: AuthState) {
	authStateSpan.textContent = state;

	if(state === "SIGNED_IN") {
		welcomeHeader.textContent = `Welcome, ${manager.auth.user!.user_metadata.full_name}`;
	} else {
		welcomeHeader.textContent = "Welcome";
	}
}



(async () => {
	const state = await manager.auth.verifyState();
	console.log("State on page load:", state);
})();
