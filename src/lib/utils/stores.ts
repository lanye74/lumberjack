import {derived, writable} from "svelte/store";

import {formatPixels} from "$utils/formatters.js";
import type {ProfilePrefix, ProfilePretty} from "$utils/profiles.js";



export const navbarHeight = writable(0);

export const formattedNavbarHeight = derived(navbarHeight, (height) => formatPixels(height));



export function createProfileCycler(profilePrefixes: ProfilePrefix[], profilePretties: ProfilePretty[]) {
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



function createToaster() {
	const {subscribe, set, update} = writable<Toast[]>([]);
	// maps Toast.id to the corresponding timeout
	const timeouts = new Map<number, NodeJS.Timeout>();
	let nextId = 0;


	function removeToast(id: number) {
		const timeout = timeouts.get(id);

		if(timeout) {
			clearInterval(timeout);
			timeouts.delete(id);
		}

		// neat trick i learned from an LLM to remove an id'd element from an array
		update(toasts => toasts.filter(toast => toast.id !== id));
	}



	return {
		subscribe,

		// fun little type trick
		toast: (toast: Omit<Toast, "id">) => {
			const id = nextId++;
			const timeout = setTimeout(() => removeToast(id), toast.duration);
			timeouts.set(id, timeout);

			update(toasts => [...toasts, {...toast, id}]);

			return id;
		},

		dismiss: (id: number) => removeToast(id),

		clear: () => {
			timeouts.forEach(timeout => clearInterval(timeout));
			timeouts.clear();
			set([]);
		}
	};
}



export const toaster = createToaster();



type Toast = {
	duration: number;
	content: string;
	id: number;
}
