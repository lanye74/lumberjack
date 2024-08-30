import {derived, readable, writable} from "svelte/store";



export const currentDate = readable(new Date(), (set) => {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);


	return () => clearInterval(interval);
});



export const currentFormattedTime = derived(currentDate, ($date => {
	return Intl.DateTimeFormat("en", {
		hour: "numeric",
		hour12: true,

		minute: "2-digit",
		second: "2-digit"
	}).format($date);
}));



// TODO: standardize "NavBar" to Navbar
export const navBarHeight = writable(0);
