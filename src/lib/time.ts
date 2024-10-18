import {derived, readable} from "svelte/store";

import {formatTime} from "$lib/formatters.js";



export type TimePeriod = "AM" | "PM";

export type TimeSelector = {
	hours: number;
	minutes: number;
	period: TimePeriod;
}



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
	};
});



export function isTimeSelectorValid(timeSelector: TimeSelector) {
	return (timeSelector.hours >= 1 && timeSelector.hours <= 12) &&
		(timeSelector.minutes >= 0 && timeSelector.minutes <= 60) &&
		(timeSelector.period === "AM" || timeSelector.period === "PM");
}
