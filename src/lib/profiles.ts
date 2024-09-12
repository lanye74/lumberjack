import {derived} from "svelte/store";

import {createArrayIndexCycler} from "./stores.js";
import type {ProfilePrefixToPrettyMap, ProfilePrefix, ProfilePretty} from "./types/profiles.js";



const profilePrefixToPrettyMap: ProfilePrefixToPrettyMap = {
	"ast": "AST",
	"maint": "Maintenance"
};



export const profilePrefixes = Object.keys(profilePrefixToPrettyMap) as ProfilePrefix[];
export const defaultProfilePrefix = profilePrefixes[0];

export const profilePretties = Object.values(profilePrefixToPrettyMap) as ProfilePretty[];
const defaultProfilePretty = profilePretties[0];



export const currentProfileIndex = createArrayIndexCycler(profilePrefixes.length);
// can't export reactive, export a derived
export const currentProfile = derived(currentProfileIndex, (index) => mapProfilePrefixToPrettyName(profilePrefixes[index]));




// this will start at 0
const nextProfileIndex = createArrayIndexCycler(profilePrefixes.length);
// then be incremented by the initial subscription event where it receives its value
// now it's always one ahead as it should be
currentProfileIndex.subscribe(nextProfileIndex.increment);

export const nextProfile = derived(nextProfileIndex, (index) => mapProfilePrefixToPrettyName(profilePrefixes[index]));



export function mapProfilePrefixToPrettyName(profile?: ProfilePrefix) {
	return profilePrefixToPrettyMap[profile ?? defaultProfilePrefix] ?? defaultProfilePrefix;
}

// TODO: arghhhhh this is so bad
export function mapPrettyNameToProfilePrefix(profile?: ProfilePretty) {
	return profilePrefixes[profilePretties.indexOf(profile ?? defaultProfilePretty)];
}
