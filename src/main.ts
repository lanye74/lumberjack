import SupabaseManager from "./SupabaseManager.js";

import type {AuthState} from "./AuthManager.js";



const url = "https://gikuvqhvhuuooyegmotc.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpa3V2cWh2aHV1b295ZWdtb3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyNTgxMDMsImV4cCI6MjAzNDgzNDEwM30.inuy_1Id_T9M2sebgE05e-7ltiEBvFmiqUOjqQTgicw";

const manager = new SupabaseManager({url, key});


const signInButton = document.getElementById("google-sso") as HTMLButtonElement;
const signOutButton = document.getElementById("sign-out") as HTMLButtonElement;
const welcomeHeader = document.getElementById("welcome-header") as HTMLHeadingElement;
const submitLocation = document.getElementById("submit-location") as HTMLButtonElement;
const locationInput = document.getElementById("location-input") as HTMLInputElement;

manager.bindSignInTo(signInButton);
manager.bindSignOutTo(signOutButton);
manager.bindSubmitLocation(locationInput, submitLocation);
manager.authManager.authStateCallback = onAuthStateChange;


function onAuthStateChange(state: AuthState) {
	if(state === "SIGNED_IN") {
		welcomeHeader.textContent = `Welcome, ${manager.authManager.user!.user_metadata.full_name}`;
		// todo: possibly put signIn and signOutButton in auth manager (though this is only temporary so it doesn't reaaaallly matter)
		// plus when i switch to svelte i should be able to just set disabled = state === "SIGNED_IN";
		// ...not that this ui is permanent
		signInButton.disabled = true;
		signOutButton.disabled = false;
		submitLocation.disabled = false;
	} else {
		welcomeHeader.textContent = "Welcome";
		signInButton.disabled = false;
		signOutButton.disabled = true;
		submitLocation.disabled = true;
	}
}



(async () => {
	await manager.authManager.updateAuthState();
})();
