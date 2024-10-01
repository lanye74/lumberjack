// TODO: refactor this
import {derived, readable, writable} from "svelte/store";

import {formatTime} from "./formatters.js";
import type {ProfilePrefix, ProfilePretty} from "./profiles.js";



export const currentDate = readable(new Date(), (set) => {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);


	return () => clearInterval(interval);
});



export const currentFormattedTime = derived(currentDate, date => {
	const modulusHours = date.getHours() % 12;

	const padLeft = (value: number) => value.toString().padStart(2, "0");

	return {
		hours: padLeft(modulusHours === 0 ? 12 : modulusHours),
		minutes: padLeft(date.getMinutes()),
		seconds: padLeft(date.getSeconds()),
		period: date.getHours() < 12 ? "AM" : "PM",
		string: formatTime(date)
	}
});



export const navbarHeight = writable(0);



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
	const {subscribe, update} = writable<ToastWrapper[]>([]);
	let index = 0;

	return {
		subscribe,

		// what the fuck
		toast: ({content, duration}: Toast) => {
			update(old => {
				let thisIndex = index++;

				return [...old, {
					content,
					duration,

					// TODO: return a dismiss method?
					toastNumber: thisIndex,

					promise: setTimeout(() => update(oldNew => dismissToast(oldNew, thisIndex)), duration)
				}]
			})
		},

		cancelAll: () => {
			update(old => {
				old.forEach(toast => clearInterval(toast.promise));
				return old;
			});
		},

		dismiss: (toastNumber: number) => {
			console.log("dismissing")

			update(old => {
				const targetToast = old.filter(toast => toast.toastNumber === toastNumber)[0]
				clearInterval(targetToast.promise);

				return dismissToast(old, targetToast.toastNumber);
			})
		}
	};



	function dismissToast(oldNew: ToastWrapper[], thisIndex: number) {
		const arrIndex = oldNew.findIndex(toast => toast.toastNumber === thisIndex);

		const firstHalf = oldNew.slice(0, arrIndex);
		const secondHalf = oldNew.slice(arrIndex + 1);

		return [...firstHalf, ...secondHalf]
	}
}



export const toaster = createToaster();



type Toast = {
	duration: number;
	content: string;
}

type ToastWrapper = Toast & {
	toastNumber: number;
	promise: NodeJS.Timeout;
};
