import {createProfileCycler} from "$lib/stores.js";

import type {Enums} from "$types/supabase.js";



export type ProfilePrefix = Enums<"Profiles">;
// TODO: is there a better way to do this?
export type ProfilePretty = "AST" | "Maintenance";



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
