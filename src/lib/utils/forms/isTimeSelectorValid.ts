import type {TimeSelector} from "$types/forms.js";



export default function isTimeSelectorValid(timeSelector: TimeSelector) {
	return (timeSelector.hours >= 1 && timeSelector.hours <= 12) &&
		(timeSelector.minutes >= 0 && timeSelector.minutes <= 60) &&
		(timeSelector.period === "AM" || timeSelector.period === "PM");
}
