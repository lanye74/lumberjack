import createProfileCycler from "$utils/stores/profileCycler.js";

import type {ProfilePrefix, ProfilePretty} from "$types/profiles.js";



const profilePrefixToPrettyMap: Record<ProfilePrefix, ProfilePretty> = {
	"ast": "AST",
	"maint": "Maintenance"
};



// why doesn't Object.keys/.values on a record not infer the types
export const profilePrefixes = Object.keys(profilePrefixToPrettyMap) as ProfilePrefix[];
export const defaultProfilePrefix = profilePrefixes[0];

export const profilePretties = Object.values(profilePrefixToPrettyMap) as ProfilePretty[];



export const currentProfile = createProfileCycler(profilePrefixes, profilePretties);

export const nextProfile = createProfileCycler(profilePrefixes, profilePretties);

currentProfile.subscribe(state => {
	nextProfile.set(state);
	nextProfile.increment();
});
