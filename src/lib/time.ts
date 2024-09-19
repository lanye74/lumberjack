export type TimePeriod = "AM" | "PM";



export type TimeSelector = {
	hours: number;
	minutes: number;
	period: TimePeriod;
}



export function isTimeSelectorValid(timeSelector: TimeSelector) {
	return (timeSelector.hours >= 1 && timeSelector.hours <= 12) &&
		(timeSelector.minutes >= 0 && timeSelector.minutes <= 60) &&
		(timeSelector.period === "AM" || timeSelector.period === "PM");
}
