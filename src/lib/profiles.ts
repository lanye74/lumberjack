import {derived} from "svelte/store";

import {createArrayIndexCycler} from "./stores.js";



// TODO: name these sensibly
const profileNameMap = {
	"AST": "ast",
	"Maintenance": "maint"
};



export const profiles = Object.keys(profileNameMap);
export const defaultProfile = profiles[0];



export const currentProfileIndex = createArrayIndexCycler(profiles.length);
// can't export reactive, export a derived
export const currentProfile = derived(currentProfileIndex, (index) => profiles[index]);




// this will start at 0
const nextProfileIndex = createArrayIndexCycler(profiles.length);
// then be incremented by the initial subscription event where it receives its value
// now it's always one ahead as it should be
currentProfileIndex.subscribe(nextProfileIndex.increment);


export const nextProfile = derived(nextProfileIndex, (index) => profiles[index]);



export function mapProfileToPrefix(profile?: string) {
	// @ts-ignore
	return profileNameMap[profile ?? defaultProfile] ?? defaultProfile;
}
