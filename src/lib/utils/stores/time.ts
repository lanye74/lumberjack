import {derived, readable} from "svelte/store";

import {formatTime} from "$utils/formatters.js";



export const currentDate = readable(new Date(), set => {
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
	};
});
