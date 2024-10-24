import {writable} from "svelte/store";

import type {ProfilePrefix, ProfilePretty} from "$types/profiles.js";



export default function createProfileCycler(profilePrefixes: ProfilePrefix[], profilePretties: ProfilePretty[]) {
	// fun writable fact: this can be lit rally anything
	const {set, subscribe, update} = writable({
		index: 0,
		prefix: profilePrefixes[0],
		pretty: profilePretties[0]
	});

	const length = profilePrefixes.length;

	// the only time in my life i thought i'd ever declare an arrow function
	// instead of a locally scoped function, but it actually feels good here
	const wrapIndex = (index: number) => index % length;


	return {
		subscribe,
		set,

		setIndex: (index: number) => {
			const wrappedIndex = wrapIndex(index);
			set({
				index: wrappedIndex,
				prefix: profilePrefixes[wrappedIndex],
				pretty: profilePretties[wrappedIndex]
			});
		},

		setPrefix: (prefix: ProfilePrefix) => {
			const index = profilePrefixes.indexOf(prefix);
			set({
				index,
				prefix,
				pretty: profilePretties[index]
			});
		},

		increment: () => {
			update(({index: oldIndex}) => {
				const wrappedIndex = wrapIndex(oldIndex + 1);
				return {
					index: wrappedIndex,
					prefix: profilePrefixes[wrappedIndex],
					pretty: profilePretties[wrappedIndex],
				};
			});
		}
	};
}
