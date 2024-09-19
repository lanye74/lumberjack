import {isTimeSelectorValid, type TimeSelector} from "./time.js";
import type {ProfilePrefix} from "./profiles.js";



type ProfileIndexedList = {[key in ProfilePrefix]: string[]};

// TODO: make this not bad
export const jcsSites: ProfileIndexedList = {
	ast: [
		"ASH",
		"BES",
		"EJHS",
		"EJMS",
		"JCTC",
		"JELV",
		"NES",
		"RDES",
		"RED",
		"TPS",
		"WAR",
		"WES",
		"WJHS",
		"WJMS"
	],

	maint: [
		"Annex",
		"ASH",
		"BES",
		"Bradley Building",
		"Bus Garage",
		"CO",
		"EJHS",
		"EJMS",
		"JCTC",
		"JELV",
		"Maintenance",
		"NES",
		"PAC Center",
		"RDES",
		"RED",
		"TPS",
		"Transportation Department",
		"WAR",
		"WES",
		"WJHS",
		"WJMS",
	]
};



export const possibleVisitPurposes: ProfileIndexedList = {
	ast: [
		"Administration team meeting",
		"Check-in visit",
		"Problem-solving support",
		"Scheduled walkthrough",
		"Unannounced walkthrough",
		"Other"
	],
	maint: [
		"Training",
		"Grounds inspection",
		"Building inspection",
		"Vendor followup",
		"Other"
	]
};



export function parseSubmitLocationForm(formData: FormData): ParsedSubmitLocationForm {
	// TODO: make all of these their own parsers

	// though i would like to believe these fields always exist, can't trust the client xd
	const userLocation = formData.get("location-selector")?.toString().trim() ?? "";
	const userPurposeMultiple = formData.get("purpose-selector")?.toString().trim() ?? "";
	// in the formData, this field does not exist if disabled disabled (i.e., null when userPurposeMultiple !== "Other")
	const userPurposeText = formData.get("location-purpose")?.toString().trim() ?? "";

	const didTypePurpose = userPurposeMultiple === "Other";
	const userPurpose = didTypePurpose ? userPurposeText : userPurposeMultiple;

	const userProfile = (formData.get("user-profile")?.toString().trim() ?? "") as ProfilePrefix;

	const logTimeInput = formData.get("log-time")?.toString().trim() ?? "";
	const logTime = JSON.parse(logTimeInput !== "" ? logTimeInput : "null") as TimeSelector | null;

	const timeIsValid = logTime === null ? true : isTimeSelectorValid(logTime);


	const isValid = userLocation !== "" &&
	                userPurpose !== "" &&
					// @ts-ignore worry about it later
					userProfile !== "" &&
	                jcsSites[userProfile].includes(userLocation) &&
	                possibleVisitPurposes[userProfile].includes(userPurposeMultiple) &&
					timeIsValid;

	// TODO: return specific errors
	const errorMessage = isValid === false ? "You didn't complete the form!" : null;


	return {
		isValid,
		errorMessage,

		userLocation,
		userPurpose,
		didTypePurpose,

		userProfile,
		logTime
	};
}



type ParsedSubmitLocationForm = {
	isValid: boolean;
	errorMessage: string | null;

	userLocation: string;
	userPurpose: string;
	didTypePurpose: boolean;

	userProfile: ProfilePrefix;
	logTime: TimeSelector | null;
};
