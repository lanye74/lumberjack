import type {ProfilePrefix} from "$types/profiles.js";



export type ParsedSubmitLocationForm = {
	isValid: true;
	errorMessage: null;

	userLocation: string;
	userPurpose: string;
	didTypePurpose: boolean;

	userProfile: ProfilePrefix;
	logTime: TimeSelector | null;
} | {
	isValid: false;
	errorMessage: string;

	userLocation: null;
	userPurpose: null;
	didTypePurpose: null;

	userProfile: null;
	logTime: TimeSelector | null;
};



export type TimePeriod = "AM" | "PM";

// fun idea if i ever have time: store this as a nine-bit number
export type TimeSelector = {
	hours: number;
	minutes: number;
	period: TimePeriod;
};



export type ProfileIndexedList = Record<ProfilePrefix, string[]>;
