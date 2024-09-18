export type TimePlace = "hours" | "minutes" | "seconds";

export type TimePlaceWithValues = {
	name: TimePlace;
	value: string;
	isInvalid: boolean;
};



type TimePeriod = "AM" | "PM";


export type TimeSelector = {
	places: TimePlaceWithValues[];
	period: TimePeriod;
}
