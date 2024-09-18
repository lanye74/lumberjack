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



export type ParsedTimePlaces = {
	[key in TimePlace]: number;
} & {period: TimePeriod};




const isNumbersRegex = new RegExp(/^[0-9]{1,2}$/);

export function validateTimeSelector(timeSelector: TimeSelector) {
	timeSelector.places.forEach(place => {
		if(!place.value.match(isNumbersRegex)) {
			place.isInvalid = true;
			return;
		}

		if(place.value.length > 2) {
			place.isInvalid = true;
			return;
		}

		const maximumValue = place.name === "hours" ? 12 : 59;
		const parsedValue = parseInt(place.value);

		if(parsedValue > maximumValue) {
			place.isInvalid = true;
			return;
		}

		place.isInvalid = false;
	});


	return timeSelector;
}



export function isTimeSelectorValid(timeSelector: TimeSelector) {
	return validateTimeSelector(timeSelector)
		.places.every(place => !place.isInvalid) &&
		(timeSelector.period === "AM" || timeSelector.period === "PM");
}




export function timeSelectorToValues(timeSelector: TimeSelector) {
	return timeSelector.places.reduce<ParsedTimePlaces>((accumulator, current) => {
		accumulator[current.name] = parseInt(current.value);
		return accumulator
	}, {
		period: timeSelector.period,
		hours: -1,
		minutes: -1,
		seconds: -1
	});
}
