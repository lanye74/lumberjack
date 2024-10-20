import {isTimeSelectorValid, type TimeSelector} from "$utils/time.js";
import type {ProfilePrefix} from "$utils/profiles.js";



type ProfileIndexedList = Record<ProfilePrefix, string[]>;

// TODO: make this not bad
export const jcsSites: ProfileIndexedList = {
	ast: ["ASH", "BES", "EJHS", "EJMS", "JCTC", "JELV", "NES", "RDES", "RED", "TPS", "WAR", "WES", "WJHS", "WJMS"],

	maint: ["Annex", "ASH", "BES", "Bradley Building", "Bus Garage", "CO", "EJHS", "EJMS", "JCTC", "JELV", "Maintenance", "NES", "PAC Center", "RDES", "RED", "TPS", "Transportation Department", "WAR", "WES", "WJHS", "WJMS"]
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
		"Vendor follow-up",
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

	const userProfile = (formData.get("user-profile")?.toString().trim() ?? "") as ProfilePrefix | "";

	const logTimeInput = formData.get("log-time")?.toString().trim() ?? "";
	const logTime = JSON.parse(logTimeInput !== "" ? logTimeInput : "null") as TimeSelector | null;

	const timeIsValid = logTime === null ? true : isTimeSelectorValid(logTime);


	const isValid = userLocation !== "" &&
	                userPurpose !== "" &&
	                userProfile !== "" &&
	                jcsSites[userProfile].includes(userLocation) &&
	                possibleVisitPurposes[userProfile].includes(userPurposeMultiple) &&
	                timeIsValid;


	// separated to make typescript happy
	if(isValid === true) {
		return {
			isValid,
			errorMessage: null,

			userLocation,
			userPurpose,
			didTypePurpose,

			userProfile,
			logTime
		}
	} else {
		return {
			isValid,
			// TODO: return specific errors
			errorMessage: "You didn’t complete the form!",

			userLocation: null,
			userPurpose: null,
			didTypePurpose: null,

			userProfile: null,
			logTime: null
		}
	}
}



type ParsedSubmitLocationForm = {
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
