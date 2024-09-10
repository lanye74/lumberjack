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
