import isTimeSelectorValid from "$utils/forms/isTimeSelectorValid.js";
import {jcsSites, possibleVisitPurposes} from "$utils/forms/options.js";

import type {ParsedSubmitLocationForm, TimeSelector} from "$types/forms.js";
import type {ProfilePrefix} from "$types/profiles.js";



export default function parseSubmitLocationForm(formData: FormData): ParsedSubmitLocationForm {
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
