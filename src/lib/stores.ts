import {derived, readable, writable} from "svelte/store";

import {formatTime} from "./formatters.js";



export const currentDate = readable(new Date(), (set) => {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);


	return () => clearInterval(interval);
});



export const currentFormattedTime = derived(currentDate, formatTime);



export const navbarHeight = writable(0);



export function createArrayIndexCycler(arrayLength: number) {
	const {set, subscribe, update} = writable(0);

	return {
		subscribe,
		set: (value: number) => set(value),
		increment: () => update((old) => (old + 1) % arrayLength)
	}
}
