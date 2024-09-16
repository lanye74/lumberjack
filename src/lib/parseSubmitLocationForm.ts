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
	// though i would like to believe these fields always exist, can't trust the client xd
	const userLocation = formData.get("location-selector")?.toString().trim() ?? "";
	const userPurposeMultiple = formData.get("purpose-selector")?.toString().trim() ?? "";
	// in the formData, this field does not exist if disabled disabled (i.e., null when userPurposeMultiple !== "Other")
	const userPurposeText = formData.get("location-purpose")?.toString().trim() ?? "";

	const didTypePurpose = userPurposeMultiple === "Other";
	const userPurpose = didTypePurpose ? userPurposeText : userPurposeMultiple;

	const userProfile = (formData.get("user-profile")?.toString().trim() ?? "") as ProfilePrefix;


	const isValid = userLocation !== "" &&
	                userPurpose !== "" &&
					// @ts-ignore worry about it later
					userProfile !== "" &&
	                jcsSites[userProfile].includes(userLocation) &&
	                possibleVisitPurposes[userProfile].includes(userPurposeMultiple);

	// TODO: return specific errors
	const errorMessage = isValid === false ? "You didn't complete the form!" : null;


	return {
		isValid,
		errorMessage,

		userLocation: isValid ? userLocation : null,
		userPurpose: isValid ? userPurpose : null,
		didTypePurpose: isValid ? didTypePurpose : null,

		userProfile: isValid ? userProfile : null
	} as ParsedSubmitLocationForm;
}



type ParsedSubmitLocationForm = {
	isValid: true;
	errorMessage: null;

	userLocation: string;
	userPurpose: string;
	didTypePurpose: boolean;

	userProfile: ProfilePrefix;
} | {
	isValid: false;
	errorMessage: string;

	userLocation: null;
	userPurpose: null;
	didTypePurpose: null;

	userProfile: null;
};
