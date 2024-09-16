import {createProfileCycler} from "./stores.js";



export type ProfilePrefix = "ast" | "maint";
export type ProfilePretty = "AST" | "Maintenance";



const profilePrefixToPrettyMap: {[key in ProfilePrefix]: ProfilePretty} = {
	"ast": "AST",
	"maint": "Maintenance"
};



export const profilePrefixes = Object.keys(profilePrefixToPrettyMap) as ProfilePrefix[];
export const defaultProfilePrefix = profilePrefixes[0];

export const profilePretties = Object.values(profilePrefixToPrettyMap) as ProfilePretty[];



export const currentProfile = createProfileCycler(profilePrefixes, profilePretties);

export const nextProfile = createProfileCycler(profilePrefixes, profilePretties);

currentProfile.subscribe(state => {
	nextProfile.set(state);
	nextProfile.increment();
});
