import {derived} from "svelte/store";

import {createArrayIndexCycler} from "./stores.js";



// TODO: name these sensibly
const profileNameMap = {
	"ast": "AST",
	"maint": "Maintenance"
};



export const profiles = Object.keys(profileNameMap);
export const defaultProfile = profiles[0];

export const prettyProfiles = Object.values(profileNameMap);



export const currentProfileIndex = createArrayIndexCycler(profiles.length);
// can't export reactive, export a derived
export const currentProfile = derived(currentProfileIndex, (index) => mapProfilePrefixToPrettyName(profiles[index]));




// this will start at 0
const nextProfileIndex = createArrayIndexCycler(profiles.length);
// then be incremented by the initial subscription event where it receives its value
// now it's always one ahead as it should be
currentProfileIndex.subscribe(nextProfileIndex.increment);


export const nextProfile = derived(nextProfileIndex, (index) => mapProfilePrefixToPrettyName(profiles[index]));



export function mapProfilePrefixToPrettyName(profile?: string) {
	// @ts-ignore
	return profileNameMap[profile ?? defaultProfile] ?? defaultProfile;
}



// TODO: arghhhhh this is so bad
export function mapPrettyNameToProfilePrefix(profile?: string) {
	// @ts-ignore
	return profiles[prettyProfiles.indexOf(profile ?? defaultProfile)];
}
